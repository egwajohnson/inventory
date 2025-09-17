import  express  from "express";
import { AppController } from "../controller/app.controller";
import {authMiddleware} from "../middleware/auth.middleware";
import {DB_CONNECTION_URL, PORT} from "../config/system.variable"
//import { upload } from "../config/multer.config";

import dotenv from "dotenv";  
dotenv.config();

const router = express.Router();

router.post("/user/pre-register", AppController.preRegister);
router.post("/user", AppController.createUser);
router.get("/user/get" ,authMiddleware as any, AppController.getUsers);
router.delete("/user/delete/:id", authMiddleware as any, AppController.deleteUser);
router.delete("/user/email", authMiddleware as any, AppController.deleteUserByEmail);
router.get("/user/:id", authMiddleware as any, AppController.findUserById);
//router.post("/user",upload.single("image"), AppController.createUser);
router.post("/login", AppController.loginUser as any)
router.post("/product", AppController.createProduct);
//router.post("/product",upload.single("picture"), AppController.createProduct as any);
router.delete("/productName",AppController.deleteProduct);
router.get("/productName", AppController.findProductByName)
router.get("/products/list", AppController.getProducts);
router.post("/product/update", AppController.updateProduct);
router.patch("/product/update/quantity", AppController.updateProductQuantity);
router.post("/product/sale", authMiddleware as any, AppController.saleProduct);

export default router;