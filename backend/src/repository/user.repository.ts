import express from "express";
import { UserModel } from "../models/user.model";
import { IAddUser } from "../interface/user.interface";
import { userschema } from "../validation/user.schemal";
import { Types } from "mongoose";
import { OtpModel } from "../models/otp.model";
import { throwCustomError } from "../middleware/errorHandle.middleware";

export class UserRepository {
  static createUser = async (user: IAddUser) => {
    const isvalid = userschema.validate(user);

    //  if (!path) throw new Error("No file found");

    const response = await UserModel.create({
      ...user,
      //  filePath: path
    });

    return response;
  };

  static findOtp = async (otp: string) => {
    const response = await OtpModel.findOneAndUpdate({ otp });
    return response;
  };

  static findUserById = async (id: Types.ObjectId) => {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await UserModel.findById(id).select("-password");
    return response;
  };

  static findUserByEmail = async (email: string) => {
    const response = await UserModel.findOne({ email }).select("-password");
    return response;
  };

  static loginUser = async (email: string): Promise<any> => {
    if (!email) {
      throw new Error("Email and password are required");
    }

    const response = await UserModel.findOne({ email });

    if (!response) {
      throw new Error("User not found");
    }

    return response;
  };

  static otpCreate = async (email: string, otp: string) => {
    const response = await OtpModel.create({
      email,
      otp,
    });

    return response;
  };

  static getUsers = async () => {
    const response = await UserModel.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });
    return response;
  };

  static deleteUser = async (id: Types.ObjectId) => {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await UserModel.findByIdAndDelete(id)
      .select("-password -__v")
      .sort({ createdAt: -1 });
    return response;
  };

  static deleteUserByEmail = async (email: string) => {
    if(!email){
        throw throwCustomError("email needed", 400)
    }
    const response = await UserModel.findOneAndDelete({ email }).select("-__v");
    return response;
  };


}
