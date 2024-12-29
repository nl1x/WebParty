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
exports.deleteUser = deleteUser;
exports.deleteMe = deleteMe;
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const variables_1 = require("@config/variables");
const user_1 = __importDefault(require("@models/user"));
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            yield user_1.default.destroy({ where: { id: userId } });
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            "message": `The account with ID '${userId}' has been deleted.`
        });
    });
}
function deleteMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authReq = req;
        const user = authReq.user;
        try {
            yield user.destroy();
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            "message": `The account with ID '${user.id}' (${user.username}) has been deleted.`
        });
    });
}
