import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/system.variable"
//import { userModel } from "../models/user.model";
import {UserModel} from "../models/user.model"
import { Types } from "mongoose";

export interface IRequest extends Request {
  user: {
    id: Types.ObjectId;
    firstName?: string | null;
    email?: string | null;
    kycStatus?: string;
  };
}

export const invalidTokens: string[] = [];
export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split("Bearer ")[1];

  if (!token) return res.sendStatus(401);
  console.log(token);

  //check for blacklisted token

  if (invalidTokens.includes(token))
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  jwt.verify(token, JWT_SECRET, async (err, data: any) => {
    if (err) {
      return res.sendStatus(401);
    }

    const user = await UserModel.findById(new Types.ObjectId(data.userId));
    console.log(data);

    if (!user) return res.sendStatus(401);
    req.user = {
      firstName: user?.firstName,
      email: user?.email,
      id: user._id,
      //kycStatus: user.kycStatus,
    };
    next();
  });
};
