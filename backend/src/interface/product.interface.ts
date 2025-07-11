import Express from "express";

export interface product {
  productName: string;
  productPrice: number;
  description: string;
  quantity: number;
  category?: string; // Optional field
  createdAt?: Date; // Optional field for creation timestamp
  updatedAt?: Date; // Optional field for last update timestamp
  // file: string;
}
