import epress, { response }  from "express";
import { AppService } from "../service/app.service";
import { Request, Response } from "express";
import { IAddUser } from "../interface/user.interface";

export class AppController{
    static async createUser(req:Request, res:Response){
        try {
            const user = req.body as IAddUser;
            // user.picture = req.file?.path; 
            const response = await AppService.createUser(user);
             res.status(201).json(response);
        } catch (error: any) {
           res.status(400).json({ success: false, payload: error.message });
        }
    }

    // static async createProduct(req: Request, res: Response) {
    //     try {
    //         const product = req.body;
    //         product.image = req.file?.path; 
    //          if (!product.name || !product.price || !product.quantity) {
    //              throw new Error("Product name, price, and quantity are required");
    //          }
    //         const response = await AppService.createProduct(product);
    //          res.status(201).json(response);
    //     } catch (error: any) {
    //          res.status(400).json({ error: error.message });
    //     }
    // }

}