import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "../util/nodemailer";
import {otpTemplate} from "../util/otp-template";
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IAddUser } from "../interface/user.interface";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { JWT_SECRET, JWT_EXP } from "../config/system.variable";
import { preRegister } from "../interface/preReg.interface";
import {userschema, preValidate } from "../validation/user.schemal";
import {throwCustomError} from "../middleware/errorHandle.middleware";
import { productschema } from "../validation/product.schemal";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export class AppService {
  static async preRegister(user: preRegister) {
    const { error } = preValidate.validate(user);
    if (error) {
      throw throwCustomError(`Validation error: ${error.details[0].message}`, 400);
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
  }

  static async createUser(user: IAddUser) {
    if (!user) {
      throw throwCustomError("User data is required", 400);
    }

    const { error } = userschema.validate(user);
    if (error) {
      throw throwCustomError(`Validation error: ${error.details[0].message}`, 400);
    }

    const { email, password } = user;
    if (!email) {
      throw throwCustomError("Email is required",400);
    }

    if (!email.includes("@")) {
      throw throwCustomError("Invalid email format",400);
    }

    if (!password) {
      throw throwCustomError("Password is required",400);
    }
    const record = await UserRepository.findOtp(user.otp);

    if (!record) {
       throw throwCustomError("Invalid OTP222",400);
    }

    if (record.otp.toString() !== user.otp.toString()) {
       throw throwCustomError("OTP does not belong to this user",400);
    }

    const existingUser = await UserRepository.findUserByEmail(user.email);
    if (existingUser) {
      throw throwCustomError("Cannot create: User with this email already exists",400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...user,
      password: hashedPassword,
    };

    const response = await UserRepository.createUser(newUser);

    console.log("User created successfully:", response);

    return response;
  }

  static async getUsers() {
    const response = await UserRepository.getUsers();
    if (!response || response.length === 0) {
      throw throwCustomError("No users found", 404);
    }
    return response;
  }

  static async findUserById(id: Types.ObjectId): Promise<any> {
    if (!id) {
      throw throwCustomError("User ID is required", 400);
    }

    const response = await UserRepository.findUserById(id);
    if (!response) {
      throw throwCustomError("User not found", 404);
    }

    return response;
  }

  static async generateOtp(email: string) {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp); // Log the generated OTP for debugging

    const response = await UserRepository.otpCreate(email, otp);
    await response.save();
    if (!response) {
      throw throwCustomError("Failed to create OTP", 500);
    }

    return response;
  }

  static async deleteUser(id: Types.ObjectId) {
    if (!id) {
      throw throwCustomError("User ID is required", 400);
    }

    const response = await UserRepository.deleteUser(id);
    if (!response) {
      throw throwCustomError("User not found", 404);
    }

    return response;
  }

  static async loginUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw throwCustomError("Email and password are required", 400);
    }

    if (!email.includes("@")) {
      throw throwCustomError("Invalid email format", 400);
    }

    const user = await UserRepository.loginUser(email);

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
  }

  // product section

  static async createProduct(product: product) {
    if (!product) {
      throw throwCustomError("Product data is required", 400);
    }
    const { error } = productschema.validate(product);
    if (error) {
      throw throwCustomError(`Validation error: ${error.details[0].message}`, 400);
    }

    const { productName, productPrice, quantity } = product;

    // Basic validation
    if (!productName || !productPrice || !quantity) {
      throw throwCustomError("Product name, price, and quantity are required", 400);
    }

    if (isNaN(productPrice) || productPrice <= 0) {
      throw throwCustomError("Product price must be a positive number",400);
    }

    if (isNaN(quantity) || quantity < 0) {
      throw throwCustomError("Quantity must be a non-negative number", 400);
    }

    const existingProduct = await ProductRepository.findByName(productName);
    if (existingProduct) {
      throw throwCustomError("Product already exists with this name",400);
    }

    const response = await ProductRepository.addProduct({
      ...product,
    });

    return response;
  }

  static async getProducts() {
    const response = await ProductRepository.getproduct();
    if (!response || response.length === 0) {
      throw throwCustomError("No products found", 404);
    }
    return response;
  }

  static async deleteProduct(id: Types.ObjectId) {
    if (!id) {
      throw throwCustomError("Product ID is required", 400);
    }

    const product = await ProductRepository.deleteProduct(id);

    if (!product) {
      throw throwCustomError("product does not exist", 404);
    }
    return "product deleted successful";
  }

  static async findProductByName(productName: string) {
    if (!productName) {
      throw throwCustomError("product name is requred", 400);
    }

    const product = ProductRepository.findByName(productName);
    if (!product) {
      throw throwCustomError("product does not exist", 404);
    }
    return product;
  }

  static async updateProduct(productName: string, productPrice: string) {
    if (!productPrice) {
      throw throwCustomError("product price is needed to update", 400);
    }

    const productupdat = await ProductRepository.updateProduct(
      productName,
      productPrice
    );

    return productupdat;
  }
  static async updateProductQuantity(productName: string, quantity: number) {
    if (!productName || quantity === undefined) {
      throw throwCustomError("Product name and quantity are required", 400);
    }

    const productupdat = await ProductRepository.updatequantity(
      productName,
      quantity
    );

    return productupdat;
  }
  static async saleProduct(
    productId: string | Types.ObjectId,
    data: {
      productName: string;
      productPrice: number;
      quantity: number;
      totalPrice: number;
    }
  ) {
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
  }
}
