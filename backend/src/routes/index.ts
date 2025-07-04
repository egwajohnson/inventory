import  express  from "express";
import { AppController } from "../controller/app.controller";



const router = express.Router();

router.post("/user", AppController.createUser);
// router.post("/product", AppController.createProduct as any);

export default router;