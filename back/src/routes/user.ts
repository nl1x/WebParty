import { Router } from 'express';
import updateUser from "@controllers/user/update";
import { deleteUser, deleteMe } from "@controllers/user/delete";
import { file } from "@middlewares/upload-picture";
import {getUser, getUsers} from "@controllers/user/fetch";
import checkAuthentication from "@middlewares/check-authentication";
import {ROLE} from "@config/variables";
import {hasRole} from "@middlewares/has-role";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/', checkAuthentication, file('avatar', 'uploads/avatars/'), updateUser);
userRouter.delete('/me', checkAuthentication, deleteMe);
userRouter.delete('/:id', checkAuthentication, hasRole(ROLE.ADMIN), deleteUser);

export default userRouter;
