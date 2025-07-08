import express from "express";
import { UserModel } from "../models/user.model";
import { IAddUser } from "../interface/user.interface";


export class UserRepository {
    static async createUser(user:IAddUser){
        if(!user){
            throw new Error("User data is required");   
        }

        //  if (!path) throw new Error("No file found");

        const response = await UserModel.create({
            ...user,
            //  filePath: path
        });

        return response;

    }

}