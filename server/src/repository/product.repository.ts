import express from "express";
import mongoose from "mongoose";
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
    const response = await ProductModel.findOne({ slug }).select("-__v");
    return response;
  }

  static async findByName(productName: string): Promise<any> {
    const escapeRegex = (text: string) =>
      text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return await ProductModel.findOne({
      productName: {
        $regex: `^${escapeRegex(productName.trim())}$`,
        $options: "i",
      },
    }).select("-__v");
  }

  static async getprice(price: number) {
    const response = await ProductModel.findOne({ productPrice: price }).select(
      "-__v",
    );
    return response;
  }

  static async deleteProduct(id: string) {
    const response = await ProductModel.findByIdAndDelete(id).select("-__v");
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
    const { cartId, productId, quantity } = data;

    if (!userId || !productId) {
      throw new Error("User ID and Product ID are required");
    }

    // Get product price
    const product = await ProductModel.findById(productId)
      .select("productPrice")
      .session(session ?? null);

    if (!product) throw new Error("Product not found");

    const itemPrice = product.productPrice;

    let cart = await CartModel.findOne({ userId }).session(session ?? null);

    if (cart) {
      const existingItem = cart.items.find((item) =>
        new mongoose.Types.ObjectId(item.productId).equals(productId),
      );

      if (quantity === 0) {
        cart.items = cart.items.filter(
          (item) =>
            !new mongoose.Types.ObjectId(item.productId).equals(productId),
        );
      } else if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.productPrice = itemPrice;
      } else {
        cart.items.push({
          productId,
          quantity,
          productPrice: itemPrice,
          discount: 0,
        });
      }
    } else {
      // Create cart if it doesn't exist
      cart = await CartModel.create(
        [
          {
            userId,
            items: [
              {
                productId,
                quantity,
                productPrice: itemPrice,
                discount: 0,
              },
            ],
            totalPrice: quantity * itemPrice,
          },
        ],
        { session },
      ).then((res) => res[0]);
      if (!cart) throw new Error("Failed to create cart");
    }

    const itemTotal = cart.items.reduce((sum, item) => {
      const price = Number(item.productPrice ?? 0);
      const discount = Number(item.discount ?? 0);
      const effectivePrice = Math.max(price - discount, 0);
      return sum + item.quantity * effectivePrice;
    }, 0);

    const couponDiscount = cart.couponCode?.discount ?? 0;
    cart.totalPrice = Math.max(itemTotal - couponDiscount, 0);

    cart.markModified("items");
    await cart.save({ session });

    return cart;
  };

  static async updateCart(userId: Types.ObjectId) {
    const updated = await CartModel.findOne({ userId });
    return updated;
  }
  static async updateCartItem(
    userId: Types.ObjectId,
    productId: string,
    quantity: number,
  ) {
    const cart = await CartModel.findOne({ userId }).populate(
      "items.productId",
    );
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find((item) => {
      const id = item.productId._id
        ? item.productId._id.toString()
        : item.productId.toString();
      return id === productId;
    });
    if (!item) {
      throw new Error("Product not found in cart");
    }

    item.quantity += quantity;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId,
      );
    }

    cart.totalPrice = cart.items.reduce((acc, item) => {
      return acc + (item.productPrice - (item.discount || 0)) * item.quantity;
    }, 0);

    await cart.save();
    return cart;
  }
  static async clearCart(userId: Types.ObjectId) {
    const cart = await CartModel.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    return cart;
  }

  static async save(cart: any) {
    return cart.save();
  }

  static async getAllCarts() {
    const carts = await CartModel.find()
      .populate({
        path: "items.productId",
        select: "productName productPrice stock status",
      })
      .lean()
      .select("-__v");
    return carts;
  }

  static async deleteCartItem(userId: Types.ObjectId, productId: string) {
    const cart = await CartModel.findOne({ userId });

    if (!cart) return null;

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    cart.totalPrice = cart.items.reduce((acc, item) => {
      return acc + (item.productPrice - (item.discount || 0)) * item.quantity;
    }, 0);

    await cart.save();

    return cart;
  }
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
