import mongoose, { Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderValue: {
      type: Number,
      required: true,
      min: 0,
    },

    validFrom: {
      type: Date,
    },

    validTo: {
      type: Date,
    },

    usageLimit: {
      type: Number,
      min: 0,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    appliedToCustomers: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    appliedToMerchants: [
      {
        type: Types.ObjectId,
        ref: "Merchant",
      },
    ],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const CouponModel = mongoose.model("Coupon", couponSchema);
