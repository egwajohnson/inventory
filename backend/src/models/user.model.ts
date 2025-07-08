import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String},
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  DOB: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: Number },
  },
  position: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
