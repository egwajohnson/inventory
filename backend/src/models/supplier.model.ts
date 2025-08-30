import mongoose,{Types} from "mongoose";

const supplierSchema = new mongoose.Schema({
  supplierId: { type: Types.ObjectId, required: true },
  name: { type: String, required: true, unique: true, maxlength: 100 },
  contactInfo: {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const SupplierModel = mongoose.model("Supplier", supplierSchema);
