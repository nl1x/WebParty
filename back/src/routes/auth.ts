import { Router } from 'express';
import registerUser from "@controllers/user/register";
import loginUser from "@controllers/user/login";
import { file } from "@middlewares/upload-picture";

const authRouter = Router();

authRouter.post('/register', file('avatar', 'uploads/avatars/'), registerUser);
authRouter.post('/login', loginUser);

export default authRouter;
