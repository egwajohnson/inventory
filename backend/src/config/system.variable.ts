import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXP = process.env.JWT_EXP as string;
export const PORT = process.env.PORT || 5000;
export const DB_CONNECTION_URL =
  process.env.DB_CONNECTION_URL || "your_mongodb_uri";
export const characters = process.env.CHARACTERS as string;
export const App_pass = process.env.App_pass as string;
export const API_KEY = process.env.API_KEY as string;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
