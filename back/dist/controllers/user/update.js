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
exports.default = updateUser;
const avatar_1 = require("@utils/avatar");
const custom_error_1 = __importDefault(require("@errors/custom-error"));
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const variables_1 = require("@config/variables");
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authReq = req;
        const { username, password } = authReq.body;
        const avatar = authReq.file;
        if (password)
            authReq.user.password = password;
        if (username)
            authReq.user.username = username;
        if (avatar) {
            const avatarError = (0, avatar_1.checkAvatar)(avatar);
            if (avatarError instanceof custom_error_1.default)
                return (0, sequelize_1.default)(res, avatarError);
            yield (0, avatar_1.saveAvatarFile)(authReq.user, avatar.path);
        }
        // If the username unique constraint is invalid, then the error is caught and handled.
        try {
            yield authReq.user.save();
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            "message": "Your profile has been successfully updated."
        });
    });
}
