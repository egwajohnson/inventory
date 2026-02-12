import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
  title: { type: String, required: true , enum: ["Mr", "Mrs", "Ms", "Dr", "Prof"] },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, select: false, required: true },
  otp: { type: String, required: false, ref: "Otp" },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  is_virified: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: Number },
  },
  role: [{ type: String, 
    enum: ["admin", "customer", "merchant"], 
    default: "customer",
    required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
