import 'module-alias/register';
import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import userRouter from "@routes/user";

// Load the environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
