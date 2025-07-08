import { Express } from "express";
import bcrypt from "bcrypt"
import { UserRepository } from "../repository/user.repository";
import { ProductRepository } from "../repository/product.repository";
import { IAddUser } from "../interface/user.interface";
import { product } from "../interface/product.interface";


export class AppService {
  static async createUser(user: IAddUser, path:string) {
    if (!user) {
      throw new Error("User data is required");
    }

    if(user.email){
      throw new Error("Email exist");
    }

    const hashedpassword =await bcrypt.hash(user.password, 10);
    if(!hashedpassword){
      throw new Error("Some thing went wrong");
    }
    console.log(hashedpassword);
  
    const domain = `http:localhost:5000/${path}`;
    const response = await UserRepository.createUser({
      ...user, password:hashedpassword,
    }, domain);
    console.log("User created successfully:", response);

    return response;
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