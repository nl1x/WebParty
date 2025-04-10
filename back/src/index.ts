import 'module-alias/register';
import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import userRouter from "@routes/user";
import publicRouter from "@routes/public";
import authRouter from "@routes/auth";
import {initializeDatabase} from "@config/database";
import actionRouter from "@routes/action";
import cors from "cors";
import {DEFAULT} from "@config/variables";

// Load the environment variables
dotenv.config();

initializeDatabase().then(() => {
    console.log("Database ready to use !");
});

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (DEFAULT.ENVIRONMENT !== 'production') {
    const corsOptions = {
        origin: process.env.FRONTEND_URL
    };
    app.use(cors(corsOptions));
}

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/actions', actionRouter);
app.use('/', publicRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
