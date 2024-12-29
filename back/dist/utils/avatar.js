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
exports.saveAvatarFile = saveAvatarFile;
exports.saveActionProofFile = saveActionProofFile;
exports.deleteFile = deleteFile;
exports.checkFileAsImage = checkFileAsImage;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const variables_1 = require("@config/variables");
const custom_error_1 = __importStar(require("@errors/custom-error"));
function saveAvatarFile(user, currentAvatarPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const previousPath = currentAvatarPath;
        const directory = path_1.default.dirname(previousPath);
        const extension = path_1.default.extname(previousPath);
        const avatarFileName = `${user.id}_avatar${extension}`;
        const newPath = path_1.default.join(directory, avatarFileName);
        user.avatarUrl = newPath;
        yield fs_1.default.promises.rename(previousPath, newPath);
        return newPath;
    });
}
function saveActionProofFile(userAction, currentActionProofPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const previousPath = currentActionProofPath;
        const directory = path_1.default.dirname(previousPath);
        const extension = path_1.default.extname(previousPath);
        const userDirectory = path_1.default.join(directory, userAction.userId.toString());
        const avatarFileName = `${userAction.actionId}_user-action${extension}`;
        const newPath = path_1.default.join(userDirectory, avatarFileName);
        userAction.proofPicture = newPath;
        try {
            yield fs_1.default.promises.access(userDirectory);
        }
        catch (error) {
            yield fs_1.default.promises.mkdir(userDirectory, { recursive: true });
        }
        yield fs_1.default.promises.rename(previousPath, newPath);
        return newPath;
    });
}
function isFileFromMulter(file) {
    return file.path !== undefined;
}
function deleteFile(file) {
    if (!file)
        return;
    let path = null;
    if (isFileFromMulter(file)) {
        path = file.path;
    }
    else {
        path = file;
    }
    fs_1.default.promises.rm(path)
        .catch((error) => {
        console.error("An error occurred while deleting the user avatar: ", error);
    });
}
function checkFileAsImage(avatar, res) {
    console.log(avatar.mimetype);
    if (!variables_1.AUTHORIZED_FILE_TYPES.IMAGES.includes(avatar.mimetype)) {
        return new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.AVATAR_INCORRECT_FILE_TYPE, "Incorrect avatar file type.");
    }
    return null;
}
