import  express  from "express";
import { AppController } from "../controller/app.controller";
import{uploadMiddleware} from "../middleware/uploadsMiddleware";
import {authMiddleware} from "../middleware/auth.middleware";
import { upload } from "../config/multer.config";

import dotenv from "dotenv";  
dotenv.config();

const router = express.Router();

router.post("/user/pre-register", AppController.preRegister);
router.post("/user", AppController.createUser);
router.post("/users/profile", upload.single("file"), AppController.uploadProfileImage);
router.get("/user/get" ,authMiddleware as any, AppController.getUsers);
router.delete("/user/delete/:id", authMiddleware as any, AppController.deleteUser);
router.delete("/user/email", authMiddleware as any, AppController.deleteUserByEmail);
router.get("/user/:id", authMiddleware as any, AppController.findUserById);
router.post("/login", AppController.loginUser as any);
router.post("/user/gen-otp", AppController.createOtp);
router.post("/user/reset-password", AppController.passwordReset);

//product routes
router.post("/product",authMiddleware as any, upload.single("image"),uploadMiddleware as any, AppController.createProduct as any);
router.delete("/productName",authMiddleware as any, AppController.deleteProduct);
router.get("/productName", authMiddleware as any, AppController.findProductByName)
router.get("/products/list", AppController.getProducts);
router.post("/product/update", AppController.updateProduct);
router.patch("/product/update/quantity", AppController.updateProductQuantity);
router.post("/product/sale", authMiddleware as any, AppController.saleProduct);

//cart routes
router.post("/cart/create", authMiddleware as any, AppController.createCart as any);
router.post("/cart/add", authMiddleware as any, AppController.addToCart as any);

//coupon routes
router.post("/create/coupon", authMiddleware as any, AppController.createCoupon as any);
router.post("/apply/coupon", authMiddleware as any, AppController.applyCouponToCart as any);
router.get("/coupons/list", authMiddleware as any, AppController.getCoupons as any);

export default router;