import { Router } from 'express';
import createUser from "@controllers/user/create";
import {file} from "../middlewares/uploadPicture";

const userRouter = Router();

userRouter.post('/', file('avatar', 'uploads/avatars/'), createUser);
userRouter.get('/', (req, res) => {
    res.json({ message: 'test' });
});

export default userRouter;
