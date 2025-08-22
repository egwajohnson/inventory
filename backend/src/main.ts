 import express from 'express';
import { mongoConnection } from "./config/db.connection";
import { logger } from "./middleware/logger.middleware"
import router from './routes/index';


const app = express();
const cors = require('cors');
app.use(cors());


const port = 5000;

app.use(express.json());

app.use(logger);

app.use('/api', router);

mongoConnection();
app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
});