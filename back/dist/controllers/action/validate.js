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
exports.default = changeActionStatus;
const user_action_1 = __importDefault(require("@models/user-action"));
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const variables_1 = require("@config/variables");
const custom_error_1 = __importStar(require("@errors/custom-error"));
const avatar_1 = require("@utils/avatar");
const action_1 = __importDefault(require("@models/action"));
function checkUserPermissions(user, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasPermissions = yield user.hasPermission(variables_1.ROLE.ORGANISER);
        if (!hasPermissions) {
            (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.PERMISSION_DENIED));
            return false;
        }
        return true;
    });
}
function checkProofPicture(res, proofPicture, userAction) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the picture is an image
        if (proofPicture) {
            const proofPictureError = (0, avatar_1.checkFileAsImage)(proofPicture);
            if (proofPictureError instanceof custom_error_1.default) {
                (0, avatar_1.deleteFile)(proofPicture);
                (0, sequelize_1.default)(res, proofPictureError);
                return false;
            }
            yield (0, avatar_1.saveActionProofFile)(userAction, proofPicture.path);
            return true;
        }
        (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.BAD_PARAMETER, "The proof picture is missing."));
        return false;
    });
}
function changeActionStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authReq = req;
        const { id } = req.params;
        const { userId, status } = req.body;
        const proofPicture = req.file;
        const actionId = parseInt(id, 10);
        const targetId = userId ? parseInt(userId, 10) : authReq.user.id;
        let userAction = null;
        let action = null;
        try {
            if (userId) {
                const hasPermissions = yield checkUserPermissions(authReq.user, res);
                if (!hasPermissions)
                    return;
            }
            userAction = yield user_action_1.default.findOne({
                where: {
                    userId: targetId,
                    actionId: actionId
                }
            });
            action = yield action_1.default.findByPk(actionId);
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        if (userAction === null || action === null) {
            return (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.ACTION_NOT_FOUND, `The action with id [${targetId}, ${actionId}] cannot be found.`));
        }
        if (![variables_1.ACTION_STATUS.DONE, variables_1.ACTION_STATUS.NOT_DONE, variables_1.ACTION_STATUS.PENDING_APPROVAL, variables_1.ACTION_STATUS.WAITING].includes(status)) {
            return (0, sequelize_1.default)(res, new custom_error_1.default(custom_error_1.CUSTOM_ERROR_TYPE.BAD_PARAMETER, `The status '${status}' is invalid.`));
        }
        if (action.requireProof) {
            let _continue = true;
            switch (status) {
                // The user has sent the proof and wait for a validation
                case variables_1.ACTION_STATUS.PENDING_APPROVAL:
                    _continue = yield checkProofPicture(res, proofPicture, userAction);
                    break;
                // The organiser did not validate the proof picture
                case variables_1.ACTION_STATUS.NOT_DONE:
                case variables_1.ACTION_STATUS.WAITING:
                    if (proofPicture) {
                        (0, avatar_1.deleteFile)(proofPicture);
                    }
                    if (userAction.proofPicture) {
                        (0, avatar_1.deleteFile)(userAction.proofPicture);
                        userAction.proofPicture = null;
                    }
                    break;
                case variables_1.ACTION_STATUS.DONE:
                    if (proofPicture) {
                        (0, avatar_1.deleteFile)(proofPicture);
                    }
                    _continue = yield checkUserPermissions(authReq.user, res);
                    break;
            }
            if (!_continue) {
                return;
            }
        }
        userAction.status = status;
        try {
            yield userAction.save();
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            message: `Action set as '${status}'.`
        });
    });
}
