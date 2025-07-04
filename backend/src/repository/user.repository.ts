import express from "express";
import { UserModel } from "../models/user.model";
import { IAddUser } from "../interface/user.interface";


export class UserRepository {
    static async createUser(user:IAddUser){
        if(!user){
            throw new Error("User data is required");   
        }

        const response = await UserModel.create({
            ...user,
        });

        return response;

    }

}