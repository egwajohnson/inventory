import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "../util/nodemailer";
import { otpTemplate } from "../util/otp-template";
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IAddUser } from "../interface/user.interface";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { JWT_SECRET, JWT_EXP } from "../config/system.variable";
import { ImagePath } from "../interface/image.terface";
import { preRegister } from "../interface/preReg.interface";
import {
  userschema,
  preValidate,
  profileSchema,
} from "../validation/user.schemal";
import { throwCustomError } from "../middleware/errorHandle.middleware";
import { productschema } from "../validation/product.schemal";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import path from "path";
import { CartModel } from "../models/cart.model";

export class AppService {
  static preRegister = async (user: preRegister) => {
    const { error } = preValidate.validate(user);
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400
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
      otpTemplate
    );

    return "OTP has been sent to your email to continue.";
  };

  static createUser = async (user: any, file: Express.Multer.File) => {
    if (!user) {
      throw throwCustomError("User data is required", 400);
    }

    const { error } = userschema.validate(user);
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400
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
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      ...user,
      password: hashedPassword,
      image: file.path,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    const response = await UserRepository.createUser(payload);

    console.log("User created successfully:", response);

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
        400
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
        "Invalid image type. Only JPEG, PNG, and WEBP are allowed."
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

    return response;
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

  static loginUser = async (email: string, password: string, ipAddress: string, userAgent: string): Promise<any> => {
    if (!email || !password) {
      throw throwCustomError("Email and password are required", 400);
    }

    if (!email.includes("@")) {
      throw throwCustomError("Invalid email format", 400);
    }

    const user = await UserRepository.loginUser(email, password, ipAddress, userAgent);

    if (!user) {
      throw throwCustomError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      throw throwCustomError("Invalid email or password", 401);
    }
    const payload = {
      userId: user._id,
    };

    let jwttoken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP,
    } as any);

    if (!jwttoken) throw throwCustomError("Unable to login", 500);

    console.log("JWT Token:", jwttoken);

    return {
      message: `Successful login. Welcome ${user.firstName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: jwttoken,
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
      409
    );
  }
    const genOtp = await AppService.generateOtp(email);
    if (!genOtp || !genOtp.otp) {
      throw throwCustomError("Failed to generate OTP", 500);
    }

    const response = await UserRepository.otpCreate(email, genOtp.otp);
    // sendMail(
    //   {
    //     email: user!.email,
    //     subject: " VERIFICATION OTP",
    //     emailInfo: {
    //       otp: genOtp.otp.toString(),
    //        name: `${user.email}`,
    //     },
    //   },
    //   otpTemplate
    // );
    return "OTP has been sent to your email to continue.";
  }

  static passwordReset = async (
    email: string,
    otp: string,
    newPassword: string
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

    const response = await UserRepository.passwordReset(email, otp, hashedPassword);

    return "Password has been reset successfully.";
  };  

  // product section

  static createProduct = async (
    product: product,
    userId: Types.ObjectId,
    path: string
  ) => {
    if (!product) {
      throw throwCustomError("Product data is required", 400);
    }
    const { error } = productschema.validate(product);
    if (error) {
      throw throwCustomError(
        `Validation error: ${error.details[0].message}`,
        400
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
    const sku = "SKU-" + Date.now();  // simple example
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

    const response = await ProductRepository.addProduct({
      ...product,
      productPrice: price,
      quantity: qty,
      image: path,
    }, userId);

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

  static deleteProduct = async (id: Types.ObjectId) => {
    if (!id) {
      throw throwCustomError("Product ID is required", 400);
    }

    const product = await ProductRepository.deleteProduct(id);

    if (!product) {
      throw throwCustomError("product does not exist", 404);
    }
    return "product deleted successful";
  };

  static findProductByName = async (productName: string) => {
    if (!productName) {
      throw throwCustomError("product name is requred", 400);
    }

    const product = ProductRepository.findByName(productName);
    if (!product) {
      throw throwCustomError("product does not exist", 404);
    }
    return product;
  };

  static updateProduct = async (productName: string, productPrice: string) => {
    if (!productPrice) {
      throw throwCustomError("product price is needed to update", 400);
    }

    const productupdat = await ProductRepository.updateProduct(
      productName,
      productPrice
    );

    return productupdat;
  };
  static updateProductQuantity = async (
    productName: string,
    quantity: number
  ) => {
    if (!productName || quantity === undefined) {
      throw throwCustomError("Product name and quantity are required", 400);
    }

    const productupdat = await ProductRepository.updatequantity(
      productName,
      quantity
    );

    return productupdat;
  };
  static saleProduct = async (
    productId: string | Types.ObjectId,
    data: {
      productName: string;
      productPrice: number;
      quantity: number;
      totalPrice: number;
    }
  ) => {
    const { productName, productPrice, quantity, totalPrice } = data;

    const quantities = await ProductModel.findOne({ quantity: quantity });

    if (data.productPrice <= 0 || data.quantity <= 0 || data.totalPrice <= 0) {
      throw throwCustomError(
        "Product price, quantity, and total price must be positive numbers",
        400
      );
    }

    if (
      !productName ||
      !productPrice ||
      quantity === undefined ||
      totalPrice === undefined
    ) {
      throw throwCustomError(
        "Product name, product price, quantity, and total price are required",
        400
      );
    }

    const convertedProductId =
      typeof productId === "string" ? new Types.ObjectId(productId) : productId;

    const product = await ProductModel.findById(convertedProductId);

    if (!product) {
      throw throwCustomError("Product not found", 404);
    }

    if (product.quantity < quantity) {
      throw throwCustomError("Insufficient quantity available for sale", 400);
    }

    // Update product (e.g., reduce stock or mark as sold)
    const updatedProduct = await ProductRepository.saleProduct(
      convertedProductId,
      data
    );

    if (updatedProduct) {
      // Save history if product update succeeded
      await ProductRepository.createsaleHistory(
        convertedProductId,
        productName,
        productPrice,
        quantity,
        totalPrice
      );
    }

    // Return receipt object
    return {
      receipt: {
        productId: convertedProductId.toString(),
        productName,
        productPrice,
        quantity,
        totalPrice,
        date: new Date().toISOString(),
      },
      message: "Sale completed successfully",
      //  updatedProduct,
    };
  };

  //cart section service

  static createCart = async (userId: Types.ObjectId) => {
     if (!userId) {
      throw new Error("User ID is required to fetch the cart.");
    }
    const existingCart = await ProductRepository.getCart(userId);
    if (existingCart) {
      return existingCart;
    }
    const cart = await CartModel.create({ userId, items: [] ,totalPrice: 0});
    return cart;
  }
}
