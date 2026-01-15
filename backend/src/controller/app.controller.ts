import epress, { response } from "express";
import { AppService } from "../service/app.service";
import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../middleware/errorHandle.middleware";
import { get } from "mongoose";
import { IRequest } from "../middleware/auth.middleware";
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

  static createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const filePath = req.file?.path;
      // const user = req.body;
      const file = req.file;
      const user  = req.body;
      console.log("Received body:", user);
      console.log("Received file:", file);
       if (!file) {
      throw throwCustomError("User image is required", 400);
    }
      //user.image = filePath;

      const response = await AppService.createUser(user, file);
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

  static uploadProfileImage = async (req: Request, res: Response) => {
    try {
      const userId = req.body;
      const { path } = req.body;
      console.log("Received body:", req.body);
      const filePath = req.file?.path;
      const response = await AppService.uploadProfileImage(userId as any, {
        ...path,
        imageUrl: filePath,
      });
      res.status(201).json(response);
      console.log("Profile image uploaded successfully:", response);
    } catch (error: any) {
      console.log("Error uploading profile image:", error);
      res.status(400).json({ success: false, payload: error.message.details });
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
      const { email } = req.body;
      console.log("type of email:", typeof email, "value:", email);
      const response = AppService.deleteUserByEmail(email);
      console.log(response);
      res.status(200).json({ success: true, payload: "User Deleted" });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
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
      const ipAddress = req.ip as string;
      const userAgent = req.get("User-Agent") || "";

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }
      const response = await AppService.loginUser(email, password, ipAddress, userAgent);
      return res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      console.error("Login error:", error);
      return res.status(404).json({ success: false, payload: error.message });
    }
  };

  static createOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body; 
      if (!email) {
        throw throwCustomError("Email is required", 400);
      } 
      const response = await AppService.otpCreate(email);
      res.status(201).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({ success: false, payload: error.message });
    }
  };

  static passwordReset = async (req: Request, res: Response) => {
    try {
      const { email, otp, newPassword } = req.body;

      const response = await AppService.passwordReset(email, otp, newPassword);
      res.status(200).json({ success: true, payload: response });
    } catch (error: any) {
      res.status(400).json({ success: false, payload: error.message });
    }
  };

  // product section

  static createProduct = async (
    req: IRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user.id;
      console.log("Authenticated user ID:", userId);
      const product = req.body;
      console.log("Received body:", product);

      if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Product image is required",
      });
    }
      const path = req.file.path;
      product.image = path;

      const response = await AppService.createProduct(product, userId, path);
      return res.status(201).json({ success: true, payload: response });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || "Something went wrong",
      });
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

  //cart section controller

  static createCart = async (req: IRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const response = await AppService.createCart(userId);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };

  static addToCart = async (req: IRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const data = req.body;
      const response = await AppService.addToCart(userId, data);
      res.status(201).json(response);
    } catch (error: any) {
      res.status(404).json({ success: false, payload: error.message });
    }
  };
}
