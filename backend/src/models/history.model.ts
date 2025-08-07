import { optional, required, string, types } from "joi";
import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  producName: {type: String, required: true},
  productPrice: {type: String, required: true},
  quantity: {type: Number, required: true},
  totalPrice: {type: Number, required: true},
  timestamp: { type: Date, default: Date.now },
});

export const HistoryModel = mongoose.model("History", historySchema);
