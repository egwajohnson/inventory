import express from "express";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { Types } from "mongoose";


export class ProductRepository {
  static async addProduct(product: product) {
    if (!product.productName || !product.productPrice || !product.quantity) {
      throw new Error("Product name, price, and quantity are required");
    }
    
    const response = await ProductModel.create({...product, createdAt: new Date(), updatedAt: new Date() });
    return response;

  }
  static async getproduct(){
    const response = await ProductModel.find( {}).sort({ createdAt: -1 }).select("-__v");
   return response;
  }

  static async findByName(productName: string): Promise<any>{

    const response = await ProductModel.findOne({productName})
    return response
  }

  static  async deleteProduct(id: Types.ObjectId) {
    const response = await ProductModel.findByIdAndDelete({ _id: id });
    return response;

  }

  static async updateProduct( productName:string, productPrice:string) {

    const response = await ProductModel.findOneAndUpdate( { productName} , {productPrice }, { new: true });
    return response;   
  }

}

