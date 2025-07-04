import express from "express";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    picture: { type: String },
  },
  {
    timestamps: true, 
  }
);

export const ProductModel = mongoose.model("Product", productSchema);
