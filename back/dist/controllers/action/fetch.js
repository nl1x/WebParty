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
exports.getPendingApprovalActions = getPendingApprovalActions;
const user_action_1 = __importDefault(require("@models/user-action"));
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const custom_error_1 = __importStar(require("@errors/custom-error"));
const variables_1 = require("@config/variables");
const action_1 = __importDefault(require("@models/action"));
const user_1 = __importDefault(require("@models/user"));
const role_1 = __importDefault(require("@models/role"));
function getPendingApprovalActions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userActions = null;
        try {
            userActions = yield user_action_1.default.findAll({
                where: {
                    status: variables_1.ACTION_STATUS.PENDING_APPROVAL
                },
                attributes: { exclude: ['userId', 'actionId'] },
                include: [
                    {
                        model: action_1.default,
                        as: 'action',
                        attributes: { exclude: ['id'] }
                    },
                    {
                        model: user_1.default,
                        as: 'user',
                        attributes: { exclude: ['id', 'password', 'roleName', 'currentActionIndex', 'actionsId'] },
                        include: [{
                                model: role_1.default,
                                as: 'role'
                            }]
                    }
                ],
            });
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        if (userActions === null) {
            return (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.BAD_PARAMETER, "No action have been found."));
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            actions: userActions
        });
    });
}
