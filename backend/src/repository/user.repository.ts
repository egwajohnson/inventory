import express from "express";
import { UserModel } from "../models/user.model";
import { IAddUser } from "../interface/user.interface";
import { userschema } from "../validation/user.schemal";
import { Types } from "mongoose";
import { OtpModel } from "../models/otp.model";


export class UserRepository {
    static async createUser(user:IAddUser){

       const isvalid = userschema.validate(user);

        //  if (!path) throw new Error("No file found");

        const response = await UserModel.create({
            ...user,
            //  filePath: path
        });

        return response;

    }

    static async findOtp(otp: string){
      const response = await OtpModel.findOne({ otp });
      return response;
    }

    static async findUserById(id: Types.ObjectId) {
        if (!id) {
            throw new Error("User ID is required");
        }

        const response = await UserModel.findById(id).select("-password");
        return response;
    }

    static async findUserByEmail(email: string){
        const response = await UserModel.findOne({email}).select("-password")
        return response;

    }

    static async loginUser(email: string): Promise<any>{
         if (!email) {
    throw new Error("Email and password are required");
  }

        const response = await UserModel.findOne({email});

            if (!response) {
                throw new Error("User not found");
            }

        return response;

    }

    static async otpCreate(email: string, otp: string){
        const response = await OtpModel.create({
            email,
            otp
        });

        return response;
    }

    static async getUsers(){
        const response = await UserModel.find().select("-password -__v").sort({ createdAt: -1 });
        return response;
    }

    static async deleteUser(id: Types.ObjectId){
        if (!id) {
            throw new Error("User ID is required");
        }

        const response = await UserModel.findByIdAndDelete(id).select("-password -__v").sort({ createdAt: -1 });
        return response;
    }

}