import { Express } from "express";
import bcrypt from "bcrypt";
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IAddUser } from "../interface/user.interface";
import { product } from "../interface/product.interface";
import { UserModel } from "../models/user.model";
import { errorMonitor } from "events";

export class AppService {
  static async createUser(user: IAddUser) {
    if (!user) {
      throw new Error("User data is required");
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
      throw new Error("User with this email already exists");
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

  static async loginUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new Error("Email and password are required");
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

    return {
      message: `Successful login. Welcome ${user.firstName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  // product section

  static async createProduct(product: product) {
    if (!product) {
      throw new Error("Product data is required");
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

    const existingProduct = await ProductRepository.findByName(productName); // custom method needed
  if (existingProduct) {
    throw new Error("Product already exists with this name");
  }

    const response = await ProductRepository.addProduct({
      ...product,
    });

    return response;
  }

  static async deleteProduct(productName:string){
   if(!productName){
      throw new Error("product name is required")
   }

   const product = ProductRepository.deleteProduct(productName)
   if(!product){
    throw new Error("product does not exist")
   }
   return("product deleted successful");
  }

  static async findProductByName(productName:string){
  if(!productName){
    throw new Error("product name is requred")
  }

  const product = ProductRepository.findByName(productName)
  if(!product){
    throw new Error("product does not exist")
  }
  return product;
  }

}
