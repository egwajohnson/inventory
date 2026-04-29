import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/system.variable";
import { UserModel } from "../models/user.model";
import { Types } from "mongoose";
import { UserRole } from "../interface/user.interface";
import mongoose from "mongoose";

export interface IRequest extends Request {
  user?: {
    id: Types.ObjectId;
    firstName?: string | null;
    email?: string | null;
    position: UserRole[];
    kycStatus?: string;
  };
}

export const invalidTokens: Set<string> = new Set();
export const authMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization token missing or malformed",
      });
      return;
    }

    const token = authHeader.split("Bearer ")[1];

    console.log(token);

    if (invalidTokens.has(token))
      res.status(403).json({
        success: false,
        message: "Token is invalidated",
      });
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return;
    }

    const user = await UserModel.findById(
      new Types.ObjectId(decoded.userId),
    ).select("firstName email position");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = {
      firstName: user?.firstName,
      email: user?.email,
      id: user._id,
      position: user.position as UserRole[],
      //kycStatus: user.kycStatus,
    };
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
