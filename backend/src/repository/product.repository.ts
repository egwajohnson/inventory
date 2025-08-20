import express from "express";
import { product } from "../interface/product.interface";
import { ProductModel } from "../models/product.model";
import { SaleModel } from "../models/sale.model";
import { Types } from "mongoose";
import { HistoryModel } from "../models/history.model";
import { productschema } from "../validation/product.schemal";

export class ProductRepository {
  static async addProduct(product: product) {

    const valid = productschema.validate(product);

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

  static async getprice(price: number){

    const response = await ProductModel.findOne({productPrice:price})
    return response

  }

  static  async deleteProduct(id: Types.ObjectId) {
    const response = await ProductModel.findByIdAndDelete({ _id: id });
    return response;

  }

  static async updateProduct( productName:string, productPrice:string) {

    const response = await ProductModel.findOneAndUpdate( { productName} , {productPrice }, { new: true }).select("-__v");
    return response;   
  }
  static async updatequantity(productName: string, quantity: number) {
    const response = await ProductModel.findOneAndUpdate(
      { productName },
      { quantity },
      { new: true }
    ).select("-__v");
    return response;
  }

  static async saleProduct(productId: Types.ObjectId, data: { productName: string, productPrice: number, quantity: number, totalPrice: number }) {

    if (
  !productId ||
  !data.productName ||
  !data.productPrice ||
  typeof data.quantity !== "number" ||
  typeof data.totalPrice !== "number"
) {
  throw new Error("Product name, product price, quantity, and total price are required and must be valid");
}

    const response = await SaleModel.create({
      productId,
      ...data,
      timestamp: new Date(),  
    })

    return response;
  }

  static async createsaleHistory(productId:Types.ObjectId, producName: string, quantity: any, productPrice: number,  totalPrice:number){

     const total = quantity * productPrice;

    const response = await HistoryModel.create({
      productId,
      producName,
      productPrice,
      quantity,
      totalPrice:total
    })

  }

  static async producthistory(userId: Types.ObjectId, action: string) {
    const response = await ProductModel.create({
      userId,
      action,
      timestamp: new Date(),
    });
    return response;
  }

}

