import { Types } from "mongoose";

export interface product {
  productName: string;
  productPrice: number;
  slug?: string;
  sku?: string;
  quantity: number;
  description: string;
  discount?: number;
  category: string;
}
export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  productPrice: number;
  discount?: number;
}

export interface Cart {
  userId: Types.ObjectId;
  cartId?: Types.ObjectId;
  items: CartItem[];
  totalPrice?: number;
  couponCode?: {
    code: string;
    discount: number;
  };
}

export interface AddToCartDTO {
  productId: Types.ObjectId;
  cartId: Types.ObjectId;
  quantity: number;
}

export interface ISale {
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  timestamp?: Date; // Optional field for sale timestamp
}
