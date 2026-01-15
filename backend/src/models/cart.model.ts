import { optional, required } from "joi";
import mongoose,{Schema} from "mongoose";

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  productPrice : {type :Number, required: false , optional}
});

export const CartItem = mongoose.model('CartItem', cartItemSchema);

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  couponCode: { type: String },
  discount: { type: Number, default: 0, min: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
});

export const CartModel = mongoose.model('Cart', cartSchema);