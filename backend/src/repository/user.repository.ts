import express from "express";
import { UserModel } from "../models/user.model";
import { IAddUser } from "../interface/user.interface";


export class UserRepository {
    static async createUser(user:IAddUser){

        //  if (!path) throw new Error("No file found");

        const response = await UserModel.create({
            ...user,
            //  filePath: path
        });

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

        return response;

    }

}