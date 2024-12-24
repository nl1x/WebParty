"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_picture_1 = require("@middlewares/upload-picture");
const check_authentication_1 = __importDefault(require("@middlewares/check-authentication"));
const validate_1 = __importDefault(require("@controllers/action/validate"));
const has_role_1 = require("@middlewares/has-role");
const variables_1 = require("@config/variables");
const assign_1 = __importDefault(require("@controllers/action/assign"));
const create_1 = __importDefault(require("@controllers/action/create"));
const actionRouter = (0, express_1.Router)();
actionRouter.post('/create', check_authentication_1.default, (0, has_role_1.hasRole)(variables_1.ROLE.ADMIN), create_1.default);
actionRouter.post('/assign-all', check_authentication_1.default, (0, has_role_1.hasRole)(variables_1.ROLE.ADMIN), assign_1.default);
actionRouter.patch('/edit/:id', check_authentication_1.default, (0, upload_picture_1.file)('proofPicture', 'uploads/actions/'), validate_1.default);
exports.default = actionRouter;
