import { Express } from "express";
import bcrypt from "bcrypt";
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IAddUser } from "../interface/user.interface";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import {JWT_SECRET, JWT_EXP} from "../config/system.variable";
import { userschema } from "../validation/user.schemal";
import { productschema } from "../validation/product.schemal";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export class AppService {
  static async createUser(user: IAddUser) {
    if (!user) {
      throw new Error("User data is required");
    }

    const { error } = userschema.validate(user);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const { email, password } = user;

    if (!email) {
      throw new Error("Email is required");
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const existingUser = await UserRepository.findUserByEmail(user.email);
    if (existingUser) {
      throw new Error("Cannot create: User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...user,
      password: hashedPassword,
    };

    const response = await UserRepository.createUser(newUser);

    //console.log("User created successfully:", response);

    return response;
  }

  static async getUsers() {
    const response = await UserRepository.getUsers();
    if (!response || response.length === 0) {
      throw new Error("No users found");
    }
    return response;

  }

  static async findUserById(id: Types.ObjectId): Promise<any> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await UserRepository.findUserById(id);
    if (!response) {
      throw new Error("User not found");
    }

    return response;
  }

  static async deleteUser(id: Types.ObjectId) {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await UserRepository.deleteUser(id);
    if (!response) {
      throw new Error("User not found");
    }

    return response;
  }

  static async loginUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email format");
    }

    const user = await UserRepository.loginUser(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
     const payload = {
      userId: user._id,
    };


    let jwttoken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXP,
    } as any);

    if (!jwttoken) throw new Error("Unable to login");

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
      throw new Error("Product data is required");
    }
    const { error } = productschema.validate(product);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const { productName, productPrice, quantity } = product;

    // Basic validation
    if (!productName || !productPrice || !quantity) {
      throw new Error("Product name, price, and quantity are required 3");
    }

    if (isNaN(productPrice) || productPrice <= 0) {
      throw new Error("Product price must be a positive number");
    }

    if (isNaN(quantity) || quantity < 0) {
      throw new Error("Quantity must be a non-negative number");
    }

    const existingProduct = await ProductRepository.findByName(productName);
    if (existingProduct) {
      throw new Error("Product already exists with this name");
    }

    const response = await ProductRepository.addProduct({
      ...product,
    });

    return response;
  }

  static async getProducts() {
    const response = await ProductRepository.getproduct();
    if (!response || response.length === 0) {
      throw new Error("No products found");
    }
    return response;
  }

  static async deleteProduct(id: Types.ObjectId) {
    if (!id) {
      throw new Error("Product ID is required");
    }

    const product = await ProductRepository.deleteProduct(id);

    if (!product) {
      throw new Error("product does not exist");
    }
    return "product deleted successful";
  }

  static async findProductByName(productName: string) {
    if (!productName) {
      throw new Error("product name is requred");
    }

    const product = ProductRepository.findByName(productName);
    if (!product) {
      throw new Error("product does not exist");
    }
    return product;
  }

  static async updateProduct(productName: string, productPrice: string) {
    if (!productPrice) {
      throw new Error("product price is needed to update");
    }

    const productupdat = await ProductRepository.updateProduct(
      productName,
      productPrice
    );

    return productupdat;
  }
  static async updateProductQuantity(productName: string, quantity: number) {
    if (!productName || quantity === undefined) {
      throw new Error("Product name and quantity are required");
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

  const quantities = await ProductModel.findOne({quantity:quantity});

  if(data.productPrice <= 0 || data.quantity <= 0 || data.totalPrice <= 0) {
    throw new Error("Product price, quantity, and total price must be positive numbers");
  }

  if (!productName || !productPrice || quantity === undefined || totalPrice === undefined) {
    throw new Error("Product name, product price, quantity, and total price are required");
  }

  

  const convertedProductId =
    typeof productId === "string" ? new Types.ObjectId(productId) : productId;

    const product = await ProductModel.findById(convertedProductId);

  if (!product) {
    throw new Error("Product not found");
  }

    if (product.quantity < quantity) {
    throw new Error("Insufficient quantity available for sale");
  }

  // Update product (e.g., reduce stock or mark as sold)
  const updatedProduct = await ProductRepository.saleProduct(convertedProductId, data);

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
