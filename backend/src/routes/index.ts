import  express  from "express";
import { AppController } from "../controller/app.controller";
import {validator} from "../middleware/validate.middleware";
import {loginSchema,userschema, productschema} from "../validation/user.schemal"
//import { upload } from "../config/multer.config";



const router = express.Router();

router.post("/user",validator(userschema), AppController.createUser);
//router.post("/user",upload.single("image"), AppController.createUser);
router.post("/login", AppController.loginUser)
router.post("/product", AppController.createProduct);
//router.post("/product",upload.single("picture"), AppController.createProduct as any);
router.delete("/productName",AppController.deleteProduct);
router.get("/productName", AppController.findProductByName)

export default router;