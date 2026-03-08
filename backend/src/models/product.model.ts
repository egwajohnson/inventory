import express from "express";
import { optional, required } from "joi";
import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    // categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    supplierId: { type: Types.ObjectId, ref: "Supplier" },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    slug: { type: String, required: true },
    sku: { type: String, required: true, maxlength: 50 },
    quantity: { type: Number, required: true },
    description: { type: String, optional: true },
    category: { type: String, required: true },
    file: { type: String, optional: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = mongoose.model("Product", productSchema);
