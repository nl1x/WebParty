import User from "@models/user";
import path from "path";
import fs from "fs";
import {Response} from "express";
import {AUTHORIZED_FILE_TYPES, CODE_STATUS} from "@config/variables";

export async function saveAvatarFile(user: User, avatarPath: string)
{
    const previousPath = avatarPath;
    const directory = path.dirname(previousPath);
    const extension = path.extname(previousPath);
    const avatarFileName = `${user.id}_avatar${extension}`;
    const newPath = path.join(directory, avatarFileName);

    user.avatarUrl = newPath;
    await fs.promises.rename(previousPath, newPath);

    return newPath;
}

export function deleteAvatar(avatar: Express.Multer.File|undefined)
{
    if (!avatar)
        return;

    fs.promises.rm(avatar.path)
        .catch((error) => {
            console.error("An error occurred while deleting the user avatar: ", error);
        });
}

export function isAvatarValid(avatar: Express.Multer.File, res: Response): boolean
{
    if (!AUTHORIZED_FILE_TYPES.IMAGES.includes(avatar.mimetype)) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Incorrect avatar file type."
        });
        return false;
    }

    return true;
}