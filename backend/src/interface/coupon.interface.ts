
import { Types } from "mongoose";

export interface ICoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  validFrom?: Date;
  validTo?: Date;
  usageLimit?: number;
  usageCount?: number;
  appliedToCustomers?: Types.ObjectId[];
  appliedToMerchants?: Types.ObjectId[];
  active?: boolean;
}

export interface DiscountResult {
  discountAmount: number;
  finalAmount: number;
}
