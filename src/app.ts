import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import router from './routers'
import { handleApplicationErrors } from './middlewares/error-handling-middleware'



dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(router);

app.use(handleApplicationErrors);


export default app;