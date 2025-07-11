import { Express } from "express";
import bcrypt from "bcrypt"
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

  const existingUser = await UserRepository.loginUser(email);
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

  const isPasswordValid = await bcrypt.compare(password, user.password as string);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    message: `Successful login. Welcome ${user.firstName}`,
    firstName: user.firstName,
    lastName: user.lastName, // fixed typo
    email: user.email, // optional
  };
}


    static async createProduct(product: product) {
        if (!product) {
        throw new Error("Product data is required");
        }
    
        const response = await ProductRepository.addProduct({
            ...product,
        }); 
    
        return response;
    }
  
}