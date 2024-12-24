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
exports.getUsers = getUsers;
exports.getUser = getUser;
const user_1 = __importDefault(require("@models/user"));
const variables_1 = require("@config/variables");
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const custom_error_1 = __importStar(require("@errors/custom-error"));
const role_1 = __importDefault(require("@models/role"));
const user_action_1 = __importDefault(require("@models/user-action"));
// ===============================
//   TODO : Review this function
// ===============================
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        user_1.default.findAll({
            attributes: { exclude: ['password'] },
            include: [
                { model: role_1.default, as: 'role' },
                { model: user_action_1.default, as: 'actions' }
            ]
        })
            .then((users) => {
            res.status(variables_1.CODE_STATUS.SUCCESS).json({
                "users": users
            });
        })
            .catch((error) => {
            (0, sequelize_1.default)(res, error);
        });
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: userId } = req.params;
        if (!userId)
            return (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.BAD_PARAMETER, "The parameter 'id' is missing."));
        // Check if the userId is a positive integer
        if (!(/^\d+$/.test(userId)))
            return (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.BAD_PARAMETER, "The parameter 'id' should be a positive integer."));
        const user = yield user_1.default.findByPk(parseInt(userId), {
            attributes: {
                exclude: ['password']
            },
            include: [{ model: role_1.default, as: 'role' }, { model: user_action_1.default, as: 'actions' }]
        });
        if (user === null) {
            return (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.USER_NOT_FOUND, "The requested user cannot be found."));
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            "user": user
        });
    });
}
