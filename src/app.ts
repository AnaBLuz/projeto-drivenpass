import express, { Express, json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import router from './routers'
import { handleApplicationErrors } from './middlewares/error-handling-middleware'
import { loadEnv } from './config/envs';
import { connectDb, disconnectDB } from './config/database';

loadEnv();

dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(router);

app.use(handleApplicationErrors);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
  }
  
  export async function close(): Promise<void> {
    await disconnectDB();
  }
  


export default app;