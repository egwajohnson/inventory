import { optional } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ["Mr", "Mrs", "Ms", "Dr", "Prof"],
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  userName: { type: String, required: false, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, select: false, required: true },
  otp: { type: String, required: false, ref: "Otp" },
  image: { type: String, optional: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: Number },
  },
  position: [
    {
      type: String,
      enum: ["Admin", "Manager", "Customer", "Merchant"],
      default: "Customer",
      required: true,
    },
  ],
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
