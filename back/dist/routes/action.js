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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_picture_1 = require("@middlewares/upload-picture");
const check_authentication_1 = __importDefault(require("@middlewares/check-authentication"));
const validate_1 = __importStar(require("@controllers/action/validate"));
const has_role_1 = require("@middlewares/has-role");
const variables_1 = require("@config/variables");
const assign_1 = __importDefault(require("@controllers/action/assign"));
const create_1 = __importDefault(require("@controllers/action/create"));
const fetch_1 = require("@controllers/action/fetch");
const actionRouter = (0, express_1.Router)();
actionRouter.post('/create', check_authentication_1.default, (0, has_role_1.hasRole)(variables_1.ROLE.ADMIN), create_1.default);
actionRouter.post('/assign-all', check_authentication_1.default, (0, has_role_1.hasRole)(variables_1.ROLE.ADMIN), assign_1.default);
actionRouter.patch('/edit/:id', check_authentication_1.default, (0, has_role_1.hasRole)(variables_1.ROLE.ADMIN), (0, upload_picture_1.file)('proofPicture', 'uploads/actions/'), validate_1.default);
actionRouter.patch('/validate-current', check_authentication_1.default, (0, upload_picture_1.file)('proofPicture', 'uploads/actions/'), validate_1.validateAction);
actionRouter.post('/:id/approve-action', check_authentication_1.default, (0, has_role_1.hasPermissionsOf)(variables_1.ROLE.ORGANISER), validate_1.approveAction);
actionRouter.get('/pending-approval', check_authentication_1.default, (0, has_role_1.hasPermissionsOf)(variables_1.ROLE.ORGANISER), fetch_1.getPendingApprovalActions);
exports.default = actionRouter;
