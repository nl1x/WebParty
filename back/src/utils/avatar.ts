import User from "@models/user";
import path from "path";
import fs from "fs";
import {Response} from "express";
import {AUTHORIZED_FILE_TYPES} from "@config/variables";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";

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

function isAvatarFromMulter(avatar: Express.Multer.File|any): avatar is Express.Multer.File {
    return (<Express.Multer.File>avatar).path !== undefined;
}

export function deleteAvatar(avatar: Express.Multer.File|string|undefined)
{
    if (!avatar)
        return;

    let path = null;
    if (isAvatarFromMulter(avatar)) {
        path = avatar.path;
    } else {
        path = avatar;
    }

    fs.promises.rm(path)
        .catch((error) => {
            console.error("An error occurred while deleting the user avatar: ", error);
        });
}

export function checkAvatar(avatar: Express.Multer.File, res?: Response): boolean|CustomError|null
{
    if (!AUTHORIZED_FILE_TYPES.IMAGES.includes(avatar.mimetype)) {
        // res.status(CODE_STATUS.BAD_REQUEST).json({
        //     "message": "Incorrect avatar file type."
        // });
        // return false;
        return new CustomError(
            CUSTOM_ERROR_TYPE.AVATAR_INCORRECT_FILE_TYPE,
            "Incorrect avatar file type."
        );
    }

    return null;
}