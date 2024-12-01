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
exports.saveAvatarFile = saveAvatarFile;
exports.deleteAvatar = deleteAvatar;
exports.isAvatarValid = isAvatarValid;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const variables_1 = require("@config/variables");
function saveAvatarFile(user, avatarPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const previousPath = avatarPath;
        const directory = path_1.default.dirname(previousPath);
        const extension = path_1.default.extname(previousPath);
        const avatarFileName = `${user.id}_avatar${extension}`;
        const newPath = path_1.default.join(directory, avatarFileName);
        user.avatarUrl = newPath;
        yield fs_1.default.promises.rename(previousPath, newPath);
        return newPath;
    });
}
function deleteAvatar(avatar) {
    if (!avatar)
        return;
    fs_1.default.promises.rm(avatar.path)
        .catch((error) => {
        console.error("An error occurred while deleting the user avatar: ", error);
    });
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
