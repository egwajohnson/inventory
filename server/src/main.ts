import express from "express";
import { mongoConnection } from "./config/db.connection";
import { logger } from "./middleware/logger.middleware";
import { PORT } from "./config/system.variable";
import cors from "cors";
import path from "path";
import router from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.static(path.join(__dirname, "public")));

app.use(logger);

app.use("/api/v1", router);

mongoConnection();
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
