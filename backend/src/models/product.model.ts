import express from "express";
import { optional } from "joi";
import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    productPrice: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // file: { type: String },
  },
  {
    timestamps: true, 
  }
);

export const ProductModel = mongoose.model("Product", productSchema);
