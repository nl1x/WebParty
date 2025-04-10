import { Request, Response } from 'express';
import { AuthenticatedRequest } from "@utils/token";
import { checkFileAsImage, saveAvatarFile } from "@utils/avatar";
import CustomError from "@errors/custom-error";
import handleRequestError from "@errors/sequelize";
import {CODE_STATUS} from "@config/variables";
import hashPassword from "@utils/hash";

export default async function updateUser(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const { username, password, displayName } = authReq.body;
    const avatar = authReq.file;

    if (password) {
        try {
            authReq.user.password = await hashPassword(password);
        } catch (error) {
            res.status(CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("An error occurred while hashing the user password: ", error);
            return;
        }
    }

    if (username)
        authReq.user.username = username;

    if (displayName)
        authReq.user.displayName = displayName;

    if (avatar) {
        const avatarError = checkFileAsImage(avatar);
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
