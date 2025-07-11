import express from "express";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: String, required: true },
    description: {type: String, },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    // file: { type: String },
  },
  {
    timestamps: true, 
  }
);

export const ProductModel = mongoose.model("Product", productSchema);
