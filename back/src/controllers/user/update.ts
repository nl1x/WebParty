import { Request, Response } from 'express';
import { AuthenticatedRequest } from "@utils/token";
import {deleteAvatar, checkAvatar, saveAvatarFile} from "@utils/avatar";
import CustomError from "@errors/custom-error";
import handleRequestError from "@errors/sequelize";
import {CODE_STATUS} from "@config/variables";

export default async function updateUser(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const { username, password } = authReq.body;
    const avatar = authReq.file;

    if (password)
        authReq.user.password = password;
    if (username)
        authReq.user.username = username;

    if (avatar) {
        const avatarError = checkAvatar(avatar);
        if (avatarError instanceof CustomError)
            return handleRequestError(res, avatarError);

        await saveAvatarFile(authReq.user, avatar.path);
    }

    // If the username unique constraint is invalid, then the error is caught and handled.
    try {
        await authReq.user.save();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "message": "Your profile has been successfully updated."
    });
}
