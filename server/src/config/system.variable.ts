import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXP = process.env.JWT_EXP as string;
export const PORT = process.env.PORT || 5000;
export const local_host = process.env.local as string;
export const dburl = process.env.dburl as string;
export const characters = process.env.CHARACTERS as string;
export const App_pass = process.env.App_pass as string;
export const API_KEY = process.env.API_KEY as string;
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;
