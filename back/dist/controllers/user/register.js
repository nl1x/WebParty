"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const hash_1 = __importDefault(require("@utils/hash"));
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const avatar_1 = require("@utils/avatar");
const token_1 = __importDefault(require("@utils/token"));
const custom_error_1 = __importStar(require("@errors/custom-error"));
function checkUsername(username) {
    // Checks the length of the username
    if (username.length > variables_1.VAR_LENGTH.USERNAME) {
        return new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.USERNAME_TOO_MUCH_CHARACTERS, `The username must not exceed ${variables_1.VAR_LENGTH.USERNAME} characters.`);
    }
    // Check if the username is alphanumeric
    if (!variables_1.REGEX.USERNAME_RULES.test(username)) {
        return new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.USERNAME_INCORRECT_CHARACTERS, "The only accepted characters for the username are alphanumeric characters, '-' and '_'.");
    }
    return null;
}
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body['username'];
        const password = req.body['password'];
        const avatar = req.file;
        // Checks if all the required parameters exists
        if (!username || !password) {
            (0, avatar_1.deleteFile)(avatar);
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": "Missing parameters..."
            });
            return;
        }
        // Check if the avatar is an image
        if (avatar) {
            const avatarError = (0, avatar_1.checkFileAsImage)(avatar);
            if (avatarError instanceof custom_error_1.default) {
                (0, avatar_1.deleteFile)(avatar);
                return (0, sequelize_1.default)(res, avatarError);
            }
        }
        // Check if the username is valid (length, alphanumeric characters only, ...)
        const usernameError = checkUsername(username);
        if (username instanceof custom_error_1.default)
            return (0, sequelize_1.default)(res, usernameError);
        let hashedPassword;
        try {
            hashedPassword = yield (0, hash_1.default)(password);
        }
        catch (error) {
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("An error occurred while hashing the user password: ", error);
            (0, avatar_1.deleteFile)(avatar);
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
            (0, avatar_1.deleteFile)(avatar);
            return (0, sequelize_1.default)(res, error, {
                uniqueConstraint: "Username already taken."
            });
        }
        // Set the avatar correct path
        if (avatar)
            yield (0, avatar_1.saveAvatarFile)(user, avatar.path);
        try {
            user = yield user.save();
        }
        catch (error) {
            yield user.destroy();
            (0, avatar_1.deleteFile)(avatar);
            return (0, sequelize_1.default)(res, error);
        }
        const token = yield (0, token_1.default)(user);
        res.status(variables_1.CODE_STATUS.SUCCESS)
            .cookie('session', token, {
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            "message": "Your account has been successfully registered.",
        });
    });
}
