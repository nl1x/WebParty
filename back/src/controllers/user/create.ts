import { Request, Response } from 'express';
import {
    AUTHORIZED_FILE_TYPES,
    CODE_STATUS,
    VAR_LENGTH,
    REGEX, DEFAULT
} from "@config/variables";
import User from "@models/user";
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

function manageAvatarFile(user: User, avatarPath: string)
{
    const previousPath = avatarPath;
    const directory = path.dirname(previousPath);
    const extension = path.extname(previousPath);
    const avatarFileName = `${user.id}_avatar${extension}`;
    const newPath = path.join(directory, avatarFileName);

    user.avatarUrl = newPath;
    fs.renameSync(previousPath, newPath);

    return newPath;
}

function isAvatarValid(avatar: Express.Multer.File, res: Response): boolean
{
    if (!AUTHORIZED_FILE_TYPES.IMAGES.includes(avatar.mimetype)) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Incorrect avatar file type."
        });
        return false;
    }

    return true;
}

function isUsernameValid(username: string, res: Response) : boolean
{
    // Checks the length of the username
    if (username.length > VAR_LENGTH.USERNAME) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": `The username must not exceed ${VAR_LENGTH.USERNAME} characters.`
        });
        return false;
    }

    // Check if the username is alphanumeric
    if (!REGEX.USERNAME_RULES.test(username)) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "The only accepted characters for the username are alphanumeric characters, '-' and '_'."
        })
        return false;
    }

    return true;
}

function hashPassword(password: string) : Promise<string>
{
    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, DEFAULT.BCRYPT_SALT);
            resolve(hashedPassword);
        } catch (error) {
            console.error('Error hashing password:', error);
            reject(error);
        }
    });
}

export default async function createUser(req: Request, res: Response)
{
    const username = req.body['username'];
    const password = req.body['password'];
    const avatar = req.file;

    // Checks if all the required parameters exists
    if (!username || !password) {
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Missing parameters..."
        });
        return;
    }

    // Check if the username is valid (length, alphanumeric characters only, ...)
    if (!isUsernameValid(username, res) || (avatar && !isAvatarValid(avatar, res)))
        return;

    // TODO: Test this feature
    let hashedPassword: string;
    try {
        hashedPassword = await hashPassword(password);
    } catch (error) {
        res.status(CODE_STATUS.INTERNAL).json({
            "message": "An internal error occurred..."
        });
        console.error("An error occurred while hashing the user password: ", error);
        return;
    }

    // Pre-save the user to retrieve its ID
    let user: User;
    try {
        user = await User.create({
            username,
            password: hashedPassword
        });
    } catch (error) {
        res.status(CODE_STATUS.INTERNAL).json({
            "message": "An internal error occurred..."
        });
        console.error("An error occurred while creating a user: ", error);
        return;
    }

    // Set the avatar correct path
    const avatarPath = avatar
        ? manageAvatarFile(user, avatar.path)
        : DEFAULT.AVATAR_PLACEHOLDER;

    user.save()
        .then((user) => {
            res.status(CODE_STATUS.SUCCESS).json({
                "message": "User created.",
                "user": user,
                "avatar_path": avatarPath
            });
        })
        .catch((error) => {
                res.status(CODE_STATUS.INTERNAL).json({
                    "message": "An internal error occurred..."
                });
                console.error("An error occurred while saving a user profile picture: ", error);
                user.destroy();
            }
        )
}
