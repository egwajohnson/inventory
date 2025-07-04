 import express from 'express';
import { mongoConnection } from "./config/db.connection";
import router from './routes/index';

const app = express();

const port = 5000;

app.use(express.json());


app.use('/api', router);

mongoConnection();
app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
});