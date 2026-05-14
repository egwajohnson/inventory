import bcrypt from "bcrypt";
import crypto from "crypto";
import { characters } from "../config/system.variable";
import { sendMail } from "../util/nodemailer";
import { otpTemplate } from "../util/otp-template";
import { accountTemplate } from "../util/user-template";
import { loginTemplate } from "../util/login-templete";
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IRequest } from "../middleware/auth.middleware";

import { AddToCartDTO, Cart, product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { JWT_SECRET, JWT_EXP } from "../config/system.variable";
import { ImagePath } from "../interface/image.terface";
import { preRegister } from "../interface/preReg.interface";
import mongoose from "mongoose";
import {
  userschema,
  preValidate,
  profileSchema,
} from "../validation/user.schemal";
import { throwCustomError } from "../middleware/errorHandle.middleware";
import {
  productschema,
  updateCartItemSchema,
} from "../validation/product.schemal";
import jwt from "jsonwebtoken";
import { ClientSession, Types } from "mongoose";
import path from "path";
import { CartModel } from "../models/cart.model";
import { ICoupon } from "../interface/coupon.interface";
import { UserModel } from "../models/user.model";
import { CouponModel } from "../models/coupon.model";
import { SaleModel } from "../models/sale.model";
import { PaystackService } from "./paystack.services";
import { Session } from "inspector/promises";
import { createPath } from "react-router-dom";

export class AppService {
  static preRegister = async (user: preRegister) => {
    const { error } = preValidate.validate(user);
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400,
      );
    }

    const existemail = await UserRepository.findUserByEmail(user.email);
    if (existemail) {
      throw throwCustomError("Email already exists", 400);
    }

    const otp = await AppService.generateOtp(user.email);
    await UserRepository.otpCreate(user.email, otp as any);

    sendMail(
      {
        email: user.email,
        subject: "OTP VERIFICATION",
        emailInfo: {
          otp: otp.toString(),
          name: `${user.email}`,
        },
      },
      otpTemplate,
    );

    return "OTP has been sent to your email to continue.";
  };

  static createUser = async (user: any) => {
    if (!user) {
      throw throwCustomError("User data is required", 400);
    }
    console.log("Payload received in service:", user);

    const { error } = userschema.validate(user);
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400,
      );
    }

    const { email, password } = user;
    if (!email) {
      throw throwCustomError("Email is required", 400);
    }

    if (!email.includes("@")) {
      throw throwCustomError("Invalid email format", 400);
    }

    if (!password) {
      throw throwCustomError("Password is required", 400);
    }
    const record = await UserRepository.findOtp(user.otp);

    if (!record) {
      throw throwCustomError("Invalid OTP222", 400);
    }

    if (record.otp.toString() !== user.otp.toString()) {
      throw throwCustomError("OTP does not belong to this user", 400);
    }

    const existingUser = await UserRepository.findUserByEmail(user.email);
    if (existingUser) {
      throw throwCustomError(
        "Cannot create: User with this email already exists",
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      ...user,
      password: hashedPassword,
      position: user.position,
    };

    const response = await UserRepository.createUser(payload);

    console.log("User created successfully:", response);

    sendMail(
      {
        email: user.email,
        subject: "Account Successfully Created",
        emailInfo: {
          firstName: `${user.firstName} ${user.lastName}`,
          email: `${user.email}`,
        },
      },
      accountTemplate,
    );

    return response;
  };

  static getUsers = async () => {
    const response = await UserRepository.getUsers();
    if (!response || response.length === 0) {
      throw throwCustomError("No users found", 404);
    }
    return response;
  };

  static findUserById = async (id: Types.ObjectId): Promise<any> => {
    if (!id) {
      throw throwCustomError("User ID is required", 400);
    }

    const response = await UserRepository.findUserById(id);
    if (!response) {
      throw throwCustomError("User not found", 404);
    }

    return response;
  };

  static async uploadProfileImage(userId: Types.ObjectId, path: ImagePath) {
    const { imageUrl, imageType, imageSize, publicId } = path;
    const { error } = profileSchema.validate({
      imageUrl,
      imageType,
      imageSize,
      publicId,
    });
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400,
      );
    }
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!path || !path.imageUrl) {
      throw new Error("Image data is required");
    }

    // Optional: validate image type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(path.imageType)) {
      throw new Error(
        "Invalid image type. Only JPEG, PNG, and WEBP are allowed.",
      );
    }

    if (path.imageSize > maxSize) {
      throw new Error("Image size exceeds 5MB limit.");
    }

    // Upload image to repository
    const updatedUser = await UserRepository.uploadProfileImage(userId, path);

    if (!updatedUser) {
      throw new Error("Failed to upload profile image");
    }

    return {
      success: true,
      message: "Profile image uploaded successfully",
      data: updatedUser,
    };
  }

  static generateOtp = async (email: string) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);
    const response = await UserRepository.otpCreate(email, otp);
    await response.save();
    if (!response) {
      throw throwCustomError("Failed to create OTP", 500);
    }

    return otp;
  };

  static deleteUser = async (id: Types.ObjectId) => {
    if (!id) {
      throw throwCustomError("User ID is required", 400);
    }

    const response = await UserRepository.deleteUser(id);
    if (!response) {
      throw throwCustomError("User not found", 404);
    }

    return response;
  };

  static loginUser = async (
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<any> => {
    if (!email || !password) {
      throw throwCustomError("Email and password are required", 400);
    }

    if (!email.includes("@")) {
      throw throwCustomError("Invalid email format", 400);
    }

    const user = await UserRepository.loginUser(
      email,
      password,
      ipAddress,
      userAgent,
    );
    console.log("User found for login:", user.position);

    if (!user) {
      throw throwCustomError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );

    if (!isPasswordValid) {
      throw throwCustomError("Invalid email or password", 401);
    }
    const payload = {
      userId: user._id,
      position: user.position,
    };

    console.log("Payload for JWT:", payload);

    let jwttoken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP,
    } as any);

    if (!jwttoken) throw throwCustomError("Unable to login", 500);

    console.log("JWT Token:", jwttoken);

    sendMail(
      {
        email: user.email,
        subject: "LOGIN NOTIFICATION",
        emailInfo: {
          firstName: user.firstName,
          email: user.email,
          loginTime: new Date().toLocaleString(),
        },
      },
      loginTemplate,
    );

    return {
      message: `Successful login. Welcome ${user.firstName}`,
      //firstName: user.firstName,
      //lastName: user.lastName,
      //email: user.email,
      token: jwttoken,
    };
  };

  static logoutUser = async (userId: Types.ObjectId) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw throwCustomError("User ID is required to logout", 400);
    }
    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw throwCustomError("User not found", 404);
    }
    user.isLoggedIn = false;
    user.refreshToken = "";
    await user.save();
    const update = await UserRepository.logoutUser(userId);
    if (!update) {
      throw throwCustomError("Failed to logout user", 500);
    }
    return {
      success: true,
      message: "User logged out successfully",
    };
  };

  static deleteUserByEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
    const response = await UserRepository.deleteUserByEmail(email);
    if (!response) {
      throw throwCustomError("email does not exits", 500);
    }
    return response;
  };

  static otpCreate = async (email: string) => {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw throwCustomError("User with this email does not exist", 404);
    }
    const existingOtp = await UserRepository.findOtpByEmail(email);
    if (existingOtp) {
      throw throwCustomError(
        "OTP already exists. Please wait or verify the existing OTP.",
        409,
      );
    }
    const genOtp = await AppService.generateOtp(email);
    if (!genOtp || !genOtp.toString()) {
      throw throwCustomError("Failed to generate OTP", 500);
    }

    const response = await UserRepository.otpCreate(email, genOtp);
    sendMail(
      {
        email: user!.email,
        subject: " VERIFICATION OTP",
        emailInfo: {
          otp: genOtp.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate,
    );
    return "OTP has been sent to your email to continue.";
  };

  static passwordReset = async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw throwCustomError("User with this email does not exist", 404);
    }

    const existingOtp = await UserRepository.findOtpByEmail(email);
    if (!existingOtp) {
      throw throwCustomError("No OTP found for this email", 404);
    }

    if (existingOtp.otp !== otp) {
      throw throwCustomError("Invalid OTP", 400);
    }

    if (existingOtp.expiresAt && existingOtp.expiresAt < new Date()) {
      throw throwCustomError("OTP has expired", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) {
      throw throwCustomError("Failed to hash new password", 500);
    }

    const response = await UserRepository.passwordReset(
      email,
      otp,
      hashedPassword,
    );

    return "Password has been reset successfully.";
  };

  // product section

  static createProduct = async (product: product, userId: Types.ObjectId) => {
    if (!product) {
      throw throwCustomError("Product data is required", 400);
    }
    const { error } = productschema.validate(product);
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400,
      );
    }

    const { productName, productPrice, quantity } = product;

    // Explicit validation
    if (!productName) {
      throw throwCustomError("Product name is required", 400);
    }

    const price = Number(product.productPrice);
    const qty = Number(product.quantity);

    //sku
    const sku = "SKU-" + Date.now(); // simple example
    product.sku = sku;

    // Slug creation logic

    const slugs = productName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-{2,}/g, "-");

    let uniqueSlug = slugs;
    let count = 1;
    while (await ProductRepository.findBySlug(uniqueSlug)) {
      uniqueSlug = `${slugs}-${count}`;
      count++;
    }

    console.log(uniqueSlug);

    product.slug = uniqueSlug;

    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw throwCustomError("User not found", 404);
    }

    if (isNaN(price) || price <= 0) {
      throw throwCustomError("Product price must be a positive number", 400);
    }

    if (isNaN(qty) || qty < 0) {
      throw throwCustomError("Quantity must be a non-negative number", 400);
    }

    const existingProduct = await ProductRepository.findByName(productName);
    if (existingProduct) {
      throw throwCustomError("Product already exists with this name", 400);
    }

    const response = await ProductRepository.addProduct(product, userId);

    return response;
  };

  static getProducts = async (filter: { page: string; limit: string }) => {
    const page = parseInt(filter.page) || 1;
    const limit = parseInt(filter.limit) || 10;

    const response = await ProductRepository.getproduct(page, limit);
    if (!response) {
      throw throwCustomError("No products found", 404);
    }
    return response;
  };

  static deleteProduct = async (id: string) => {
    if (!id) {
      throw throwCustomError("Product ID is required", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw throwCustomError("Invalid product ID", 400);
    }

    const product = await ProductRepository.deleteProduct(id as any);

    if (!product) {
      throw throwCustomError("product does not exist", 404);
    }
    return { message: "Product deleted successfully" };
  };

  static findProductByName = async (productName: string) => {
    if (!productName) {
      throw throwCustomError("product name is requred", 400);
    }

    const product = await ProductRepository.findByName(productName);
    if (!product) {
      throw throwCustomError("product does not exist", 404);
    }
    return {
      success: true,
      payload: product,
    };
  };

  static updateProduct = async (productName: string, productPrice: string) => {
    if (!productPrice) {
      throw throwCustomError("product price is needed to update", 400);
    }

    const productupdat = await ProductRepository.updateProduct(
      productName,
      productPrice,
    );

    return productupdat;
  };
  static updateProductQuantity = async (
    productName: string,
    quantity: number,
  ) => {
    if (!productName || quantity === undefined) {
      throw throwCustomError("Product name and quantity are required", 400);
    }

    const productupdat = await ProductRepository.updatequantity(
      productName,
      quantity,
    );

    return productupdat;
  };
  static saleProduct = async (
    userId: Types.ObjectId,
    cartId: Types.ObjectId,
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
    },
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const objectUserId = new Types.ObjectId(userId);
      const objectCartId = new Types.ObjectId(cartId);

      const user = await UserModel.findById(objectUserId).session(session);
      if (!user) {
        throw throwCustomError("User not found", 404);
      }
      if (!user?.email) {
        throw throwCustomError("User email is required for sale", 400);
      }

      const cart = await CartModel.findOne({
        _id: objectCartId,
        userId: objectUserId,
      }).session(session);
      console.log("Cart found for sale:", cart);
      if (!cart) {
        throw throwCustomError("Cart not found", 404);
      }

      if (!cart.items || cart.items.length === 0) {
        throw throwCustomError("Cart is empty", 400);
      }

      if (!cart.totalPrice || cart.totalPrice <= 0) {
        throw throwCustomError("Cart total price is invalid", 400);
      }

      const getsale = await SaleModel.findOne({ cartId: objectCartId }).session(
        session,
      );
      if (getsale) {
        throw throwCustomError(
          "This cart has already been processed for sale",
          400,
        );
      }

      const saleId = `ORD-${Date.now()}`;

      const sale = await SaleModel.create(
        [
          {
            userId: objectUserId,
            cartId: objectCartId,
            deliveryAddress,
            saleId,
            totalPrice: cart.totalPrice,
            subTotal: cart.totalPrice,
            currency: "NGN",
            paymentMethod: "paystack",
            paymentStatus: "pending",
          },
        ],
        { session },
      );
      if (!sale) {
        throw throwCustomError("Failed to create sale record", 500);
      }

      //initiate paymet
      const payment = await PaystackService.initializePayment(
        cart.totalPrice * 100,
        user.email,
        userId.toString(),
        saleId,
      );
      if (payment.status === "success") {
        await SaleModel.updateOne({ saleId }, { paymentStatus: "completed" });

        await CartModel.updateOne(
          { _id: objectCartId, userId: objectUserId },
          { $set: { items: [], totalPrice: 0 } },
        );

        console.log("Cart cleared after successful payment");
      }

      if (!payment) {
        await SaleModel.updateOne({ saleId }, { paymentStatus: "failed" });
        throw throwCustomError("Failed to initialize payment", 500);
      }
      await session.commitTransaction();
      session.endSession();
      return {
        successful: true,
        message: "Sale processed successfully. Proceed to payment.",
        data: sale[0],
        payment: payment,
      };
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      if (error.statuscode) throw error;
      throw throwCustomError(error.message || "Internal server error", 500);
    }
  };

  //cart section service

  static createCart = async (userId: Types.ObjectId) => {
    if (!userId) {
      throw throwCustomError("User ID is required to fetch the cart.", 400);
    }
    const existingCart = await ProductRepository.getCart(userId);
    if (existingCart) {
      return existingCart;
    }
    const cart = await CartModel.create({ userId, items: [], totalPrice: 0 });
    return cart;
  };

  static addToCart = async (userId: Types.ObjectId, data: AddToCartDTO) => {
    const { error, value } = updateCartItemSchema.validate(data);
    if (error) {
      throw throwCustomError(error.details[0].message, 400);
    }

    if (!userId) {
      throw throwCustomError(
        "User ID is required to add items to the cart.",
        400,
      );
    }

    const useTransaction = process.env.USE_TRANSACTIONS === "true";
    let session: ClientSession | undefined;

    try {
      if (useTransaction) {
        session = await mongoose.startSession();
        session.startTransaction();
      }
      const cart = await ProductRepository.addToCart(userId, value, session);
      if (!cart) {
        throw throwCustomError("Failed to add item to cart", 500);
      }
      if (session) {
        await session.commitTransaction();
      }
      return cart;
    } catch (error: any) {
      if (session) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  };

  static getCart = async (userId: Types.ObjectId) => {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw throwCustomError("Invalid user ID", 400);
    }
    const cart = await ProductRepository.getCart(userId);
    if (!cart) {
      throw throwCustomError("Cart not found", 404);
    }
    return cart;
  };

  static updateCart = async (
    userId: Types.ObjectId,
    productId: string,
    quantity: number,
  ) => {
    if (!userId) {
      throw throwCustomError("User ID is required to update the cart.", 400);
    }

    if (!productId) {
      throw throwCustomError("Product ID is required.", 400);
    }

    if (!quantity || quantity < 1) {
      throw throwCustomError("Valid quantity is required", 400);
    }

    const cart = await ProductRepository.updateCart(userId);
    if (!cart) {
      throw throwCustomError("Cart not found", 404);
    }

    const existingItem = cart.items.find((item) =>
      new mongoose.Types.ObjectId(item.productId).equals(productId),
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const product =
        await ProductModel.findById(productId).select("productPrice");
      if (!product) throw throwCustomError("Product not found", 404);

      cart.items.push({
        productId: product._id,
        quantity,
        productPrice: product.productPrice,
        discount: 0,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) =>
        sum + (item.productPrice - (item.discount || 0)) * item.quantity,
      0,
    );

    cart.markModified("items");
    await cart.save();

    return cart;
  };
  static async updateCartItem(
    userId: Types.ObjectId,
    productId: string,
    quantity: number,
  ) {
    if (!userId) {
      throw throwCustomError("User ID is required to update cart item.", 400);
    }

    if (!productId) {
      throw throwCustomError("Product ID is required.", 400);
    }

    if (quantity === 0) {
      throw throwCustomError("Quantity cannot be zero", 400);
    }

    const cart = await ProductRepository.updateCartItem(
      userId,
      productId,
      quantity,
    );

    if (!cart) {
      throw throwCustomError("Failed to update cart item", 500);
    }

    return cart;
  }

  static async clearCart(userId: Types.ObjectId) {
    if (!userId) {
      throw throwCustomError("User ID is required to clear the cart.", 400);
    }
    const cart = await ProductRepository.clearCart(userId);
    return cart;
  }

  //removed frm cart
  static async removeItem(
    userId: Types.ObjectId,
    productId: string,
    quantity: number,
  ) {
    const cart = await ProductRepository.updateCart(userId);

    if (!cart) {
      throw throwCustomError("Cart not found", 404);
    }

    const item = cart.items.find(
      (i: any) => i.productId.toString() === productId,
    );

    if (!item) {
      throw throwCustomError("Nothing in Cart to remove", 400);
    }

    item.quantity -= quantity;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i: any) => i.productId.toString() !== productId,
      );
    }

    cart.markModified("items");

    cart.totalPrice = cart.items.reduce(
      (acc: number, i: any) => acc + (i.productPrice - i.discount) * i.quantity,
      0,
    );

    await cart.save();
    return cart;
  }

  static async deleteCart(userId: Types.ObjectId, cartId: string) {
    const user = await UserRepository.findUserById(userId);
    if (!user) {
      throw throwCustomError("User not found.", 404);
    }

    if (!user.position?.includes("Admin")) {
      throw throwCustomError("Only admin users can delete carts.", 403);
    }
    const response = await ProductRepository.deleteCart(userId, cartId);
    if (!response) {
      throw throwCustomError("Cart not found or already deleted.", 404);
    }
    return response;
  }

  static async deleteCartItem(userId: Types.ObjectId, productId: string) {
    if (!productId) {
      throw throwCustomError("productId is required", 400);
    }
    console.log("productId hererer", productId);
    const del = await ProductRepository.deleteCartItem(userId, productId);
    console.log("delete mmmm", del);
    if (!del) {
      throw throwCustomError("product not deleted", 400);
    }

    del.items = del.items.filter(
      (item) => item.productId.toString() !== productId.toString(),
    );
    return del;
  }

  static async getAllCarts(user: IRequest["user"]) {
    if (!user?.position?.includes("Admin")) {
      throw throwCustomError("Only admin users can fetch all carts.", 403);
    }
    const carts = await ProductRepository.getAllCarts();
    if (carts.length === 0) {
      throw throwCustomError("No carts found", 404);
    }
    return carts;
  }

  // coupon section service
  static createCoupon = async (userId: Types.ObjectId, data: ICoupon) => {
    if (!userId) {
      throw throwCustomError("User ID is required to create a coupon.", 400);
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      throw throwCustomError("User not found.", 404);
    }
    if (user.position && !user.position.includes("Admin")) {
      throw throwCustomError("Only admin users can create coupons.", 403);
    }

    if (!data.discountType || !data.discountValue) {
      throw throwCustomError("Discount value and type are required.", 400);
    }

    if (data.discountValue <= 0) {
      throw throwCustomError("Discount value must be greater than zero.", 400);
    }

    if (data.discountType === "percentage" && data.discountValue > 100) {
      throw throwCustomError("Percentage discount cannot exceed 100%.", 400);
    }

    const couponCode = AppService.generateCouponCode(8);
    console.log("Generated Coupon Code:", couponCode);
    data.code = couponCode;
    if (!data.validFrom) {
      data.validFrom = new Date();
    }

    const coupon = await ProductRepository.createCoupon(userId, data);
    return coupon;
  };

  static generateCouponCode = (length: number): string => {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  static calculateDiscount(orderTotal: number, coupon?: ICoupon | null) {
    let discountAmount = 0;

    if (!coupon || orderTotal < coupon.minOrderValue) {
      return { discountAmount: 0, finalAmount: orderTotal };
    }

    if (coupon.discountType === "percentage") {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderTotal);

    return {
      discountAmount,
      finalAmount: orderTotal - discountAmount,
    };
  }

  static applyCouponToCart = async (
    userId: Types.ObjectId,
    couponCode: string,
    session?: ClientSession,
  ) => {
    if (!userId) {
      throw throwCustomError("User ID is required to apply a coupon.", 400);
    }
    if (!couponCode) {
      throw throwCustomError("Coupon code is required.", 400);
    }
    const cartQuery = CartModel.findOne({ userId });
    if (session) cartQuery.session(session);

    const cart = await cartQuery;
    if (!cart) {
      throw throwCustomError("Cart not found for the user.", 404);
    }

    const coupon = await CouponModel.findOne({
      code: couponCode.toLowerCase(),
      active: true,
    })
      .session(session ?? null)
      .lean<ICoupon>();

    if (!coupon) {
      throw throwCustomError("Invalid or inactive coupon code.", 404);
    }

    if (cart.totalPrice === undefined) {
      throw throwCustomError("Cart total price is missing.", 500);
    }

    const { discountAmount, finalAmount } = this.calculateDiscount(
      cart.totalPrice,
      coupon,
    );

    if (discountAmount <= 0) {
      throw throwCustomError("Coupon does not apply to this cart.", 400);
    }

    const updatedCart = await ProductRepository.applyCouponToCart(
      cart._id,
      { code: coupon.code, discount: coupon.discountValue },
      finalAmount,
      session,
    );
    return updatedCart;
  };

  static getCoupons = async () => {
    const response = await ProductRepository.getCoupons();
    if (!response || response.length === 0) {
      throw throwCustomError("No coupons found", 404);
    }
    return response;
  };
}
