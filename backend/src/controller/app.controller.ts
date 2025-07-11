import epress, { response }  from "express";
import { AppService } from "../service/app.service";
import { Request, Response } from "express";

export class AppController{
    static async createUser(req:Request, res:Response){
        try {
        //    const path = req.file?.path;
            const user = req.body;

        //   user.image = path;

            const response = await AppService.createUser(user);
             res.status(201).json(response);
        } catch (error: any) {
           res.status(400).json({ success: false, payload: error.message });
        }
    }


    static async loginUser(req:Request, res:Response){
        try {
            const {email, password} = req.body;
            const response = await AppService.loginUser(email , password);
            res.status(200).json(response);
        } catch (error:any) {
            res.status(404).json({success: false, payload: error.message} )
        }
    }

    static async createProduct(req: Request, res: Response) {
        try {
              const product = req.body;
              const path = req.file?.path;

              if (!path) throw new Error("No file found");

        if (!req.file) {
            return res.status(400).json({ error: "Product image is missing" });
        }

        console.log(req.file);
        
             product.image = req.file;
              

             if (!product.name || !product.price || !product.quantity) {
                 throw new Error("Product name, price, and quantity are required");
             }
             

            const response = await AppService.createProduct(product);
             res.status(201).json(response);
        } catch (error: any) {
             res.status(400).json({ error: error.message });
        }
    }

}