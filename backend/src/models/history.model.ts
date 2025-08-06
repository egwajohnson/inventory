import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const HistoryModel = mongoose.model("History", historySchema);
