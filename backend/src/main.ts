 import express from 'express';
import { mongoConnection } from "./config/db.connection";
import { logger } from "./middleware/logger.middleware";
import cors from 'cors';
import router from './routes/index';


const app = express();
app.use(cors());


const port = 5000;

app.use(express.json());

app.use(logger);

app.use('/api/v1', router);

mongoConnection();
app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
});