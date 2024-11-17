"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createUser;
const variables_1 = require("@config/variables");
const user_1 = __importDefault(require("@models/user"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function manageAvatarFile(user, avatarPath) {
    const previousPath = avatarPath;
    const directory = path_1.default.dirname(previousPath);
    const extension = path_1.default.extname(previousPath);
    const avatarFileName = `${user.id}_avatar${extension}`;
    const newPath = path_1.default.join(directory, avatarFileName);
    user.avatarUrl = newPath;
    fs_1.default.renameSync(previousPath, newPath);
    return newPath;
}
function isAvatarValid(avatar, res) {
    if (!variables_1.AUTHORIZED_FILE_TYPES.IMAGES.includes(avatar.mimetype)) {
        res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
            "message": "Incorrect avatar file type."
        });
        return false;
    }
    return true;
}
function isUsernameValid(username, res) {
    // Checks the length of the username
    if (username.length > variables_1.VAR_LENGTH.USERNAME) {
        res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
            "message": `The username must not exceed ${variables_1.VAR_LENGTH.USERNAME} characters.`
        });
        return false;
    }
    // Check if the username is alphanumeric
    if (!variables_1.REGEX.USERNAME_RULES.test(username)) {
        res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
            "message": "The only accepted characters for the username are alphanumeric characters, '-' and '_'."
        });
        return false;
    }
    return true;
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body['username'];
        const password = req.body['password'];
        const avatar = req.file;
        // Checks if all the required parameters exists
        if (!username || !password) {
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": "Missing parameters..."
            });
            return;
        }
        // Check if the username is valid (length, alphanumeric characters only, ...)
        if (!isUsernameValid(username, res) || (avatar && !isAvatarValid(avatar, res)))
            return;
        // Pre-save the user to retrieve its ID
        let user;
        try {
            user = yield user_1.default.create({
                username,
                password
            });
        }
        catch (error) {
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("An error occurred while creating a user: ", error);
            return;
        }
        // Set the avatar correct path
        const avatarPath = avatar
            ? manageAvatarFile(user, avatar.path)
            : variables_1.DEFAULT.AVATAR_PLACEHOLDER;
        user.save()
            .then((user) => {
            res.status(variables_1.CODE_STATUS.SUCCESS).json({
                "message": "User created.",
                "user": user,
                "avatar_path": avatarPath
            });
        })
            .catch((error) => {
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("An error occurred while saving a user profile picture: ", error);
        });
    });
}
