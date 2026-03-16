import express from "express";
import { optional, required } from "joi";
import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    supplierId: { type: Types.ObjectId, ref: "Supplier" },
    productName: { type: String, minlength: 2, maxlength: 120, required: true },
    productPrice: { type: Number, required: true, min: 0 },
    slug: { type: String, required: true },
    sku: { type: String, required: true, unique: true, maxlength: 50 },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    category: { type: String, trim: true, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = mongoose.model("Product", productSchema);
