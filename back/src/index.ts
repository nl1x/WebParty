import 'module-alias/register';
import dotenv from "dotenv";
import express, { Request, Response } from 'express';

// Load the environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
