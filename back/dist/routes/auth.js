"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = __importDefault(require("@controllers/user/register"));
const login_1 = __importDefault(require("@controllers/user/login"));
const upload_picture_1 = require("@middlewares/upload-picture");
const check_authentication_1 = __importDefault(require("@middlewares/check-authentication"));
const has_role_1 = require("@middlewares/has-role");
const variables_1 = require("@config/variables");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', check_authentication_1.default, (0, has_role_1.hasRole)(variables_1.ROLE.ADMIN), (0, upload_picture_1.file)('avatar', 'uploads/avatars/'), register_1.default);
authRouter.post('/login', login_1.default);
exports.default = authRouter;
