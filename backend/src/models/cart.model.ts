import mongoose, { Schema } from "mongoose";
import { Cart } from "../interface/product.interface";

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  productPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  default: [],
  couponCode: { code: String, discount: { type: Number, default: 0 } },
  totalPrice: { type: Number, required: true, default: 0 },
});

export const CartModel = mongoose.model<Cart>("Cart", cartSchema);
