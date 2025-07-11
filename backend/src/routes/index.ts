import  express  from "express";
import { AppController } from "../controller/app.controller";
import { upload } from "../config/multer.config";



const router = express.Router();

router.post("/user", AppController.createUser);
//router.post("/user",upload.single("image"), AppController.createUser);
router.post("/login", AppController.loginUser)
//router.post("/product",upload.single("picture"), AppController.createProduct as any);

export default router;