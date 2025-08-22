import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXP = process.env.JWT_EXP as string;
//export const MONGODB_URI = process.env.MONGODB_URI || "your_mongodb_uri";