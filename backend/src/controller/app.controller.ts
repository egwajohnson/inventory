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
            res.status(404).json({success: false, payload: error.message})
        }
    }


    // product section

    static async createProduct(req: Request, res: Response) {
  try {
    const product = req.body;

    // Handle file upload (e.g. product image)
    // const filePath = req.file?.path;
    // if (!filePath) {
    //   return res.status(400).json({ error: "Product image is missing" });
    // }

    // Attach image path to product data
    // product.image = filePath;


    const response = await AppService.createProduct(product);
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({success: false, payload: error.message});
  }
}


}