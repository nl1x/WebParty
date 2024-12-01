import { Request, Response } from 'express';
import {
    CODE_STATUS,
    VAR_LENGTH,
    REGEX, DEFAULT,
} from "@config/variables";
import User from "@models/user";
import hashPassword from "@utils/hash";
import handleRequestError from "@errors/sequelize";
import { isAvatarValid, saveAvatarFile, deleteAvatar } from "@utils/avatar";
import generateToken from "@utils/token";

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

export default async function registerUser(req: Request, res: Response)
{
    const username = req.body['username'];
    const password = req.body['password'];
    const avatar = req.file;

    // Checks if all the required parameters exists
    if (!username || !password) {
        deleteAvatar(avatar);
        res.status(CODE_STATUS.BAD_REQUEST).json({
            "message": "Missing parameters..."
        });
        return;
    }

    // Check if the username is valid (length, alphanumeric characters only, ...)
    if (!isUsernameValid(username, res) || (avatar && !isAvatarValid(avatar, res))) {
        deleteAvatar(avatar);
        return;
    }

    let hashedPassword: string;
    try {
        hashedPassword = await hashPassword(password);
    } catch (error) {
        res.status(CODE_STATUS.INTERNAL).json({
            "message": "An internal error occurred..."
        });
        console.error("An error occurred while hashing the user password: ", error);
        deleteAvatar(avatar);
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
        // Delete temporary avatar file
        deleteAvatar(avatar);
        return handleRequestError(res, error, {
            uniqueConstraint: "Username already taken."
        });
    }

    // Set the avatar correct path
    if (avatar)
        await saveAvatarFile(user, avatar.path);

    try {
        user = await user.save();
    } catch (error) {
        await user.destroy();
        deleteAvatar(avatar);
        return handleRequestError(res, error);
    }

    const token = await generateToken(user);

    res.status(CODE_STATUS.SUCCESS)
        .cookie('session', token, {
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            "message": "Successfully registered.",
        });
}
