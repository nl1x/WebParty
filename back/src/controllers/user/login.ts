import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import User from "@models/user";
import {CODE_STATUS} from "@config/variables";
import handleRequestErrors from "@errors/sequelize";
import generateToken from "@utils/token";
import hashPassword from "@utils/hash";
import {deleteFile} from "@utils/avatar";

export default async function loginUser(req: Request, res: Response) {
    const username = req.body['username'];
    const password = req.body['password'];

    if (!username || !password) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Missing parameters..."
        });
        return;
    }

    let user = null;
    try {
        user = await User.findOne({ where: { username } });
    } catch (error) {
        return handleRequestErrors(res, error);
    }

    if (user === null) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Incorrect 'username' or password."
        });
        return;
    }

    const passwordsMatch = await compare(password, user.password);

    if (!passwordsMatch) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Incorrect username or 'password'."
        });
        return;
    }

    const token = await generateToken(user);

    res.status(CODE_STATUS.SUCCESS)
        .cookie('session', token, {
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            "message": "Successfully authenticated.",
            "session": token
        });
}
