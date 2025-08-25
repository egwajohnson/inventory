import epress, { response } from "express";
import { AppService } from "../service/app.service";
import { Request, Response } from "express";
import { get } from "mongoose";

export class AppController {
  static async createUser(req: Request, res: Response) {
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

  static async getUsers(req:Request, res:Response){
    try {
      const get = req.body;
      const response = await AppService.getUsers();
      res.status(200).json(response);
    } catch (error:any) {
      res.status(400).json({success:false, payload:error.response})
      
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await AppService.deleteUser(id as any);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  }

  static async findUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await AppService.findUserById(id as any);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
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
      res.status(400).json({ success: false, payload: error.message });
    }
  }

  static async getProducts(req: Request, res: Response) {
    try {
      const response = await AppService.getProducts();
      res.status(200).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.body;

      const response = await AppService.deleteProduct(id as any);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  }

  static async findProductByName(req: Request, res: Response) {
    try {
      const { productName } = req.body;

      const response = await AppService.findProductByName(productName);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
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
  }

  static async updateProductQuantity(req: Request, res: Response) {
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
  }

  static async saleProduct(req: Request, res: Response) {
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
  }
}
