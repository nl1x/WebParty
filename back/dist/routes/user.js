"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const update_1 = __importDefault(require("@controllers/user/update"));
const delete_1 = __importDefault(require("@controllers/user/delete"));
const upload_picture_1 = require("@middlewares/upload-picture");
const fetch_1 = require("@controllers/user/fetch");
const check_authentication_1 = __importDefault(require("@middlewares/check-authentication"));
const userRouter = (0, express_1.Router)();
userRouter.get('/', fetch_1.getUsers);
userRouter.get('/:id', fetch_1.getUser);
userRouter.patch('/', check_authentication_1.default, (0, upload_picture_1.file)('avatar', 'uploads/avatars/'), update_1.default);
userRouter.delete('/', check_authentication_1.default, delete_1.default);
exports.default = userRouter;
