import mongoose,{Schema} from "mongoose";

const otpSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true, unique: true, index: true },
  otp: { type: String, required: true },
  //TTL index: auto-delete after 1 hour ,
  expiresAt: { type: Date, required: true, index: true },

},
 { timestamps: true }
);
 otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const OtpModel = mongoose.model("Otp", otpSchema);
