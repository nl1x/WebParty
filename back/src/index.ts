import 'module-alias/register';
import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import userRouter from "@routes/user";
import publicRouter from "@routes/public";
import authRouter from "@routes/auth";
import {initializeDatabase} from "@config/database";
import actionRouter from "@routes/action";

// Load the environment variables
dotenv.config();

initializeDatabase().then(() => {
    console.log("Database ready to use !");
});

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/actions', actionRouter);
app.use('/', publicRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
