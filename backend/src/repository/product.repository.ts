import express from "express";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { Types } from "mongoose";


export class ProductRepository {
  static async addProduct(product: product) {
    if (!product.productName || !product.productPrice || !product.quantity) {
      throw new Error("Product name, price, and quantity are required");
    }
    // if(!product.file){
    //   throw new Error("image not found")
    // }
    
    


    const response = await ProductModel.create({...product, createdAt: new Date(), updatedAt: new Date() });

    return response;


  }

  static async findByName(productName: string): Promise<any>{

    const response = await ProductModel.findOne({productName})
    return response
  }

  static  async deleteProduct(productName:string){
    const response = await ProductModel.findOneAndDelete(productName as any)
    return response

  }

 
  

}

