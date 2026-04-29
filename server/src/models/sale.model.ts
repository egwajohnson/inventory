import { required } from "joi";
import mongoose, { Types } from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
      unique: true,
    },
    subTotal: { type: Number, required: true }, //total unit price
    currency: { type: String, required: true },
    discount: { type: Number, default: 0 },
    saleId: { type: String, required: true },
    deliveryFees: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    couponCode: { type: String, required: false },
    paymentRef: { type: String, required: false },
    paymentMethod: {
      type: String,
      enum: ["paystack", "flutterwave", "stripe"],
      require: true,
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
        "refunded",
        "cancelled",
        "draft",
        "processing",
        "on-hold",
      ],
      default: "pending",
    },
    saleDate: { type: Date, default: Date.now },
    deliveryAddress: {
      street: { type: String, require: true },
      city: { type: String, require: true },
      state: { type: String, require: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const SaleModel = mongoose.model("Sale", saleSchema);
