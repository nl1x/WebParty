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
exports.default = registerUser;
const variables_1 = require("@config/variables");
const user_1 = __importDefault(require("@models/user"));
const sequelize_1 = require("sequelize");
const hash_1 = __importDefault(require("@utils/hash"));
const sequelize_2 = __importDefault(require("@errors/sequelize"));
const avatar_1 = require("@utils/avatar");
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
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body['username'];
        const password = req.body['password'];
        const avatar = req.file;
        // Checks if all the required parameters exists
        if (!username || !password) {
            (0, avatar_1.deleteAvatar)(avatar);
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": "Missing parameters..."
            });
            return;
        }
        // Check if the username is valid (length, alphanumeric characters only, ...)
        if (!isUsernameValid(username, res) || (avatar && !(0, avatar_1.isAvatarValid)(avatar, res))) {
            (0, avatar_1.deleteAvatar)(avatar);
            return;
        }
        let hashedPassword;
        try {
            hashedPassword = yield (0, hash_1.default)(password);
        }
        catch (error) {
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("An error occurred while hashing the user password: ", error);
            (0, avatar_1.deleteAvatar)(avatar);
            return;
        }
        // Pre-save the user to retrieve its ID
        let user;
        try {
            user = yield user_1.default.create({
                username,
                password: hashedPassword
            });
        }
        catch (error) {
            // Delete temporary avatar file
            (0, avatar_1.deleteAvatar)(avatar);
            if (!(error instanceof sequelize_1.Error)) {
                res.status(variables_1.CODE_STATUS.INTERNAL).json({
                    "message": "An internal error occurred..."
                });
                console.error("An error occurred while creating the user: ", error);
                return;
            }
            (0, sequelize_2.default)(res, error, {
                uniqueConstraint: "Username already taken."
            });
            return;
        }
        // Set the avatar correct path
        const avatarPath = avatar
            ? yield (0, avatar_1.manageAvatarFile)(user, avatar.path)
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
            user.destroy();
            (0, avatar_1.deleteAvatar)(avatar);
        });
    });
}
