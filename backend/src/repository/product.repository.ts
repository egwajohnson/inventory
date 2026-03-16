import express from "express";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { SaleModel } from "../models/sale.model";
import { CartModel } from "../models/cart.model";
import { CouponModel } from "../models/coupon.model";
import { AddToCartDTO, Cart } from "../interface/product.interface";
import { ClientSession, Types } from "mongoose";
import { HydratedDocument } from "mongoose";
import { HistoryModel } from "../models/history.model";
import { ICoupon } from "../interface/coupon.interface";

export class ProductRepository {
  static async addProduct(product: product, userId: Types.ObjectId) {
    const response = await ProductModel.create({
      ...product,
      userId,
    });
    return response;
  }
  static async getproduct(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const response = await ProductModel.find({})
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-__v");

    const count = await ProductModel.countDocuments();

    const total = Math.ceil(count / limit);

    return {
      products: response,
      meta: {
        pages: total,
        page: page,
        limit: limit,
        totalRecords: count,
      },
    };
  }

  static async findBySlug(slug: string) {
    const response = await ProductModel.findOne({ slug });
    return response;
  }

  static async findByName(productName: string): Promise<any> {
    const response = await ProductModel.findOne({ productName });
    return response;
  }

  static async getprice(price: number) {
    const response = await ProductModel.findOne({ productPrice: price });
    return response;
  }

  static async deleteProduct(id: Types.ObjectId) {
    const response = await ProductModel.findByIdAndDelete({ _id: id });
    return response;
  }

  static async updateProduct(productName: string, productPrice: string) {
    const response = await ProductModel.findOneAndUpdate(
      { productName },
      { productPrice },
      { new: true },
    ).select("-__v");
    return response;
  }
  static async updatequantity(productName: string, quantity: number) {
    const response = await ProductModel.findOneAndUpdate(
      { productName },
      { quantity },
      { new: true },
    ).select("-__v");
    return response;
  }

  static async saleProduct(
    userId: Types.ObjectId,
    cartId: Types.ObjectId,
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
    },
  ) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Cart not found");
    const response = await SaleModel.create({
      userId,
      cartId,
      deliveryAddress,
    });

    return response;
  }

  static async getSaleById(saleId: Types.ObjectId) {
    const response = await SaleModel.findById(saleId)
      .populate("cartId")
      .select("-__v");
    return response;
  }

  static async createsaleHistory(
    productId: Types.ObjectId,
    producName: string,
    quantity: any,
    productPrice: number,
    totalPrice: number,
  ) {
    const total = quantity * productPrice;

    const response = await HistoryModel.create({
      productId,
      producName,
      productPrice,
      quantity,
      totalPrice: total,
    });
    return response;
  }

  static async producthistory(userId: Types.ObjectId, action: string) {
    const response = await ProductModel.create({
      userId,
      action,
      timestamp: new Date(),
    });
    return response;
  }

  //cart section

  static async createCart(userId: Types.ObjectId) {
    const cart = await CartModel.create({ userId, items: [], totalPrice: 0 });
    return cart;
  }

  static async getCart(userId: Types.ObjectId) {
    const cart = await CartModel.findOne({ userId }).populate({
      path: "items.productId",
      select: "productName price image",
    });
    return cart;
  }

  static addToCart = async (
    userId: Types.ObjectId,
    data: AddToCartDTO,
    session?: ClientSession,
  ) => {
    const { cartId, quantity } = data;

    if (!userId || !data.productId) {
      throw new Error("User ID and Product ID are required");
    }

    // Get product price
    const product = await ProductModel.findById(data.productId)
      .select("productPrice")
      .session(session ?? null);
    if (!product) throw new Error("Product not found");

    const itemPrice = product.productPrice;

    //  Initialize cart variable
    let cart: HydratedDocument<Cart> | null = null;

    //  Remove item if quantity = 0
    if (quantity === 0) {
      cart = await CartModel.findOneAndUpdate(
        { _id: cartId, userId },
        { $pull: { items: { productId: data.productId } } },
        { new: true, session },
      );
    } else {
      //  Increment quantity if item exists
      cart = await CartModel.findOneAndUpdate(
        { _id: cartId, userId, "items.productId": data.productId },
        {
          $set: {
            "items.$.quantity": quantity,
            "items.$.productPrice": itemPrice,
          },
        },
        { new: true, session },
      );

      // Push new item if it doesn’t exist
      if (!cart) {
        cart = await CartModel.findOneAndUpdate(
          { _id: cartId, userId },
          {
            $push: {
              items: {
                productId: data.productId,
                quantity,
                productPrice: itemPrice,
              },
            },
          },
          { new: true, session },
        );

        // Create cart if it doesn’t exist
        if (!cart) {
          const created = await CartModel.create(
            [
              {
                userId,
                items: [
                  {
                    productId: data.productId,
                    quantity,
                    productPrice: itemPrice,
                  },
                ],
                totalPrice: quantity * itemPrice,
              },
            ],
            { session },
          );
          cart = created && created.length > 0 ? created[0] : null;
          if (!cart) throw new Error("Failed to create cart");
        }
      }
    }

    if (!cart) {
      throw new Error("Cart not found after update");
    }
    const cartQuery = CartModel.findOne({ _id: cart._id, userId });
    const finalCart = session
      ? await cartQuery.session(session)
      : await cartQuery;

    if (!finalCart) throw new Error("Cart not found after update");

    const itemTotal = finalCart.items.reduce(
      (sum, item) => {
        const productPrice = Number(item.productPrice ?? 0);
        const discount = Number(item.discount ?? 0);

        const effectivePrice = Math.max(productPrice - discount, 0);
        return sum + item.quantity * effectivePrice;
      },

      0,
    );
    const couponDiscount = finalCart.couponCode?.discount ?? 0;

    finalCart.totalPrice = Math.max(itemTotal - couponDiscount, 0);

    await finalCart.save({ session });

    return finalCart;
  };
  // coupon code creation
  static async createCoupon(userId: Types.ObjectId, data: ICoupon) {
    const coupon = await CouponModel.create({
      ...data,
      createdBy: userId,
    });
    return coupon;
  }

  //coupon code application in cart
  static async applyCouponToCart(
    cartId: Types.ObjectId,
    coupon: { code: string; discount: number },
    finalTotal: number,
    session?: ClientSession,
  ) {
    const cart = await CartModel.findOneAndUpdate(
      cartId,
      { couponCode: coupon, totalPrice: finalTotal },
      { new: true, session },
    ).select("-__v");
    return cart;
  }

  //get coupon
  static async getCoupons() {
    const coupons = await CouponModel.find().select("-__v");
    return coupons;
  }
}
