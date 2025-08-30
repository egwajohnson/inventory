import mongoose,{Types} from "mongoose";

const saleSchema = new mongoose.Schema({
    userId: { type:Types.ObjectId, ref: "User", required: true },
    saleDate: { type: Date, default: Date.now },
    items: [
        {
            saleId: { type:Types.ObjectId, ref: "Sale", required: true },
            productId: { type: Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            totalAmount: { type: Number, required: true }
        }
    ],

}, 
{timestamps: true}
);

export const SaleModel = mongoose.model("Sale", saleSchema);
