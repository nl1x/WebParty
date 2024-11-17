"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_1 = __importDefault(require("@controllers/user/create"));
const uploadPicture_1 = require("../middlewares/uploadPicture");
const userRouter = (0, express_1.Router)();
userRouter.post('/', (0, uploadPicture_1.file)('avatar', 'uploads/avatars/'), create_1.default);
userRouter.get('/', (req, res) => {
    res.json({ message: 'test' });
});
exports.default = userRouter;
