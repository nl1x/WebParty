import { Router } from 'express';
import updateUser from "@controllers/user/update";
import { getUsers } from "@controllers/user/fetch";
import { file } from "@middlewares/upload-picture";
import checkAuthentication from "@middlewares/check-authentication";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.patch('/', checkAuthentication, file('avatar', 'uploads/avatars/'), updateUser);

export default userRouter;
