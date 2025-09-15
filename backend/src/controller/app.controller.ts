import epress, { response } from "express";
import { AppService } from "../service/app.service";
import { Request, Response } from "express";
import { get } from "mongoose";

export class AppController {
  static preRegister = async (req: Request, res: Response) => {
    try {
      const user = req.body;
      const response = await AppService.preRegister(user);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, payload: error.message });
    }
  };

  static createUser = async (req: Request, res: Response) => {
    try {
      //    const path = req.file?.path;
      const user = req.body;

      //   user.image = path;

      const response = await AppService.createUser(user);
      res.status(201).json(response);
    } catch (error: any) {
      console.log("Error creating user:", error);
      res.status(400).json({ success: false, payload: error.message });
    }
  };

  static getUsers = async (req: Request, res: Response) => {
    try {
      const get = req.body;
      const response = await AppService.getUsers();
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, payload: error.response });
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const response = await AppService.deleteUser(id as any);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static deleteUserByEmail = async (req: Request, res: Response) => {
    try {
      const{ email} = req.body;
      console.log("type of email:", typeof email, "value:", email);
      const response = AppService.deleteUserByEmail(email);
      console.log(response)
      res.status(200).json({success:true, payload:"User Deleted"});
      
    } catch (error:any) {
      res.status(400).json({
        success:false,
        message:error.message
      })
    }
  };

  static findUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const response = await AppService.findUserById(id as any);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }
      const response = await AppService.loginUser(email, password);
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(404).json({ success: false, payload: error.message });
    }
  };

  // product section

  static createProduct = async (req: Request, res: Response) => {
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
      res.status(400).json({ success: false, payload: error.message });
    }
  };

  static getProducts = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as {
        page: string;
        limit: string;
      };
      const response = await AppService.getProducts({ page, limit });
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const response = await AppService.deleteProduct(id as any);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static findProductByName = async (req: Request, res: Response) => {
    try {
      const { productName } = req.body;

      const response = await AppService.findProductByName(productName);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static updateProduct = async (req: Request, res: Response) => {
    try {
      const { productName, productPrice } = req.body;

      const response = await AppService.updateProduct(
        productName,
        productPrice
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static updateProductQuantity = async (req: Request, res: Response) => {
    try {
      const { productName, quantity } = req.body;

      const response = await AppService.updateProductQuantity(
        productName,
        quantity
      );
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static saleProduct = async (req: Request, res: Response) => {
    try {
      const { productId, productName, productPrice, quantity, totalPrice } =
        req.body;

      const response = await AppService.saleProduct(productId, {
        productName,
        productPrice,
        quantity,
        totalPrice,
      });
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };
}
