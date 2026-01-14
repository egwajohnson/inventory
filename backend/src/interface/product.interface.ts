import Express from "express";

export interface product {
  productName: string;
  productPrice: number;
  slug?: string; 
  sku?: string;
  quantity: number;
  description: string;
  category?: string; 
  image?: string;
  createdAt?: Date; 
  updatedAt?: Date;
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
