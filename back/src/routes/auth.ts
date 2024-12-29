import { Router } from 'express';
import registerUser from "@controllers/user/register";
import loginUser from "@controllers/user/login";
import { file } from "@middlewares/upload-picture";
import checkAuthentication from "@middlewares/check-authentication";
import {hasRole} from "@middlewares/has-role";
import {ROLE} from "@config/variables";

const authRouter = Router();

authRouter.post('/register', checkAuthentication, hasRole(ROLE.ADMIN), file('avatar', 'uploads/avatars/'), registerUser);
authRouter.post('/login', loginUser);

export default authRouter;
