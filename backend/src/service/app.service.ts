import { Express } from "express";
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IAddUser } from "../interface/user.interface";
import { product } from "../interface/product.interface";


export class AppService {
  static async createUser(user: IAddUser) {
    if (!user) {
      throw new Error("User data is required");
    }

    const response = await UserRepository.createUser({
      ...user,
    });
    console.log("User created successfully:", response);

    return response;
  }

    // static async createProduct(product: product) {
    //     if (!product) {
    //     throw new Error("Product data is required");
    //     }
    
    //     const response = await ProductRepository.addProduct({
    //         ...product,
    //     }); 
    
    //     return response;
    // }
  
}