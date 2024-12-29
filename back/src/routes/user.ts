import { Router } from 'express';
import updateUser from "@controllers/user/update";
import { deleteUser, deleteMe } from "@controllers/user/delete";
import { file } from "@middlewares/upload-picture";
import {getMe, getUser, getUsers} from "@controllers/user/fetch";
import checkAuthentication from "@middlewares/check-authentication";
import {ROLE} from "@config/variables";
import {hasRole} from "@middlewares/has-role";
import resetUserActions from "@controllers/user/reset";

const userRouter = Router();

userRouter.get('/', checkAuthentication, getUsers);
userRouter.get('/me', checkAuthentication, getMe);
userRouter.get('/:id', getUser);
userRouter.patch('/', checkAuthentication, file('avatar', 'uploads/avatars/'), updateUser);
userRouter.delete('/me', checkAuthentication, deleteMe);
userRouter.post('/:id/reset-actions', checkAuthentication, hasRole(ROLE.ADMIN), resetUserActions);
userRouter.delete('/:id', checkAuthentication, hasRole(ROLE.ADMIN), deleteUser);

export default userRouter;
