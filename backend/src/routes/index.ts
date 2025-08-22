import  express  from "express";
import { AppController } from "../controller/app.controller";
import {authMiddleware} from "../middleware/auth.middleware";
import {validator} from "../middleware/validate.middleware";
//import { upload } from "../config/multer.config";



const router = express.Router();

router.post("/user", AppController.createUser);
// router.post("/user",validator(userschema), AppController.createUser);
router.get("/user/:id", AppController.findUserById);
//router.post("/user",upload.single("image"), AppController.createUser);
router.post("/login", AppController.loginUser)
router.post("/product", AppController.createProduct);
//router.post("/product",upload.single("picture"), AppController.createProduct as any);
router.delete("/productName",AppController.deleteProduct);
router.get("/productName", AppController.findProductByName)
router.get("/products/list", AppController.getProducts);
router.post("/product/update", AppController.updateProduct);
router.patch("/product/update/quantity", AppController.updateProductQuantity);
router.post("/product/sale", authMiddleware as any, AppController.saleProduct);

export default router;