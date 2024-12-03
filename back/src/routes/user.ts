import { Router } from 'express';
import updateUser from "@controllers/user/update";
import deleteUser from "@controllers/user/delete";
import { file } from "@middlewares/upload-picture";
import {getUser, getUsers} from "@controllers/user/fetch";
import checkAuthentication from "@middlewares/check-authentication";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/', checkAuthentication, file('avatar', 'uploads/avatars/'), updateUser);
userRouter.delete('/', checkAuthentication, deleteUser);

export default userRouter;
