import express from 'express';
import { Router } from 'express';
import { mongoConnection } from './config/db.connection';

const app = express();

const port = 5000;

app.use(express.json());


const router = Router();

mongoConnection();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});