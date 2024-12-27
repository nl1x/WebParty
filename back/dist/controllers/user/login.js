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
exports.default = loginUser;
const bcryptjs_1 = require("bcryptjs");
const user_1 = __importDefault(require("@models/user"));
const variables_1 = require("@config/variables");
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const token_1 = __importDefault(require("@utils/token"));
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body['username'];
        const password = req.body['password'];
        if (!username || !password) {
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": "Missing parameters..."
            });
            return;
        }
        let user = null;
        try {
            user = yield user_1.default.findOne({ where: { username } });
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        if (user === null) {
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": "Incorrect 'username' or password."
            });
            return;
        }
        const passwordsMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordsMatch) {
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": "Incorrect username or 'password'."
            });
            return;
        }
        const token = yield (0, token_1.default)(user);
        res.status(variables_1.CODE_STATUS.SUCCESS)
            .cookie('session', token, {
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            "message": "Successfully authenticated.",
            "session": token
        });
    });
}
