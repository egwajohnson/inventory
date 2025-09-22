import Express from "express";

export interface product {
  productName: string;
  productPrice: number;
  slug?: string; // Optional field for URL-friendly identifier
  quantity: number;
  description: string;
  category?: string; // Optional field
  file?: string;
  createdAt?: Date; // Optional field for creation timestamp
  updatedAt?: Date; // Optional field for last update timestamp
}

export interface IProductUpdate {
  productName?: string;
  productPrice?: number;
  description?: string;
  quantity?: number;
  category?: string; // Optional field
  updatedAt?: Date; // Optional field for last update timestamp
}
export interface ISale {
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  timestamp?: Date; // Optional field for sale timestamp
}
