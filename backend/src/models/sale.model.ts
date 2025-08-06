import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const SaleModel = mongoose.model("Sale", saleSchema);
