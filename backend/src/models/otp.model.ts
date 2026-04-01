import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, unique: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.statics.deleteExpired = async function () {
  return this.deleteMany({ expiresAt: { $lte: new Date() } });
}; 
export const OtpModel = mongoose.model("Otp", otpSchema);
