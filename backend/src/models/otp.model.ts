import mongoose,{Schema} from "mongoose";

const otpSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  //TTL index: auto-delete after 1 hour ,
  createdAt: { type: Date, default: Date.now, expires: "1h" },
  updatedAt: { type: Date, default: Date.now },

},
 { timestamps: true }
);
export const OtpModel = mongoose.model("Otp", otpSchema);
