import mongoose, {Types} from "mongoose";

 const purchaseSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  productId: { type:Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  Price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  purchaseDate: { type: Date, default: Date.now }
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);


