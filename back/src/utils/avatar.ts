import User from "@models/user";
import path from "path";
import fs from "fs";
import {Response} from "express";
import {AUTHORIZED_FILE_TYPES} from "@config/variables";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import UserAction from "@models/user-action";

export async function saveAvatarFile(user: User, currentAvatarPath: string)
{
    const previousPath = currentAvatarPath;
    const directory = path.dirname(previousPath);
    const extension = path.extname(previousPath);
    const avatarFileName = `${user.id}_avatar${extension}`;
    const newPath = path.join(directory, avatarFileName);

    user.avatarUrl = newPath;
    await fs.promises.rename(previousPath, newPath);

    return newPath;
}

export async function saveActionProofFile(userAction: UserAction, currentActionProofPath: string)
{
    const previousPath = currentActionProofPath;
    const directory = path.dirname(previousPath);
    const extension = path.extname(previousPath);
    const userDirectory = path.join(directory, userAction.userId.toString());
    const avatarFileName = `${userAction.actionId}_user-action${extension}`;
    const newPath = path.join(userDirectory, avatarFileName);

    userAction.proofPicture = newPath;
    try {
        await fs.promises.access(userDirectory);
    } catch (error) {
        await fs.promises.mkdir(userDirectory, { recursive: true });
    }
    await fs.promises.rename(previousPath, newPath);

    return newPath;
}

function isFileFromMulter(file: Express.Multer.File|any): file is Express.Multer.File {
    return (<Express.Multer.File>file).path !== undefined;
}

export function deleteFile(file: Express.Multer.File|string|undefined|null)
{
    if (!file)
        return;

    let path = null;
    if (isFileFromMulter(file)) {
        path = file.path;
    } else {
        path = file;
    }

    fs.promises.rm(path)
        .catch((error) => {
            console.error("An error occurred while deleting the user avatar: ", error);
        });
}

export function checkFileAsImage(avatar: Express.Multer.File, res?: Response): CustomError|null
{
    if (!AUTHORIZED_FILE_TYPES.IMAGES.includes(avatar.mimetype)) {
        return new CustomError(
            CUSTOM_ERROR_TYPE.AVATAR_INCORRECT_FILE_TYPE,
            "Incorrect avatar file type."
        );
    }

    return null;
}
