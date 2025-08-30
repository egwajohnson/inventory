import express from "express";
import { optional } from "joi";
import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    categoryId: { type:Types.ObjectId, ref: "Category", required: true },
    supplierId: { type: Types.ObjectId, ref: "Supplier" },
    sku: { type: String, required: true, unique: true, maxlength: 50 },
    quantity: { type: Number, required: true },
    Price: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    description: { type: String, optional: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // file: { type: String },
  },
  {
    timestamps: true, 
  }
);

export const ProductModel = mongoose.model("Product", productSchema);
