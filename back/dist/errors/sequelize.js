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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleRequestError;
const sequelize_1 = require("sequelize");
const variables_1 = require("@config/variables");
const custom_error_1 = __importStar(require("@errors/custom-error"));
function handleSequelizeErrors(res, error, errorMessages) {
    var _a, _b;
    switch (error.name) {
        case variables_1.SEQUELIZE_ERRORS.UNIQUE_CONSTRAINT:
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": (_a = errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.uniqueConstraint) !== null && _a !== void 0 ? _a : "Bad request." // "Username already taken."
            });
            break;
        case variables_1.SEQUELIZE_ERRORS.VALIDATION:
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": (_b = errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.validation) !== null && _b !== void 0 ? _b : "Bad request." // "The validation tests did not pass."
            });
            break;
        case variables_1.SEQUELIZE_ERRORS.DATABASE:
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("DATABASE error occurred: ", error);
            break;
        case variables_1.SEQUELIZE_ERRORS.CONNECTION_REFUSED:
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("DB_CONNECTION error occurred: ", error.name, "\nFull error can be found here:\n", error);
            break;
        default:
            res.status(variables_1.CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("UNKNOWN error occurred: ", error.name, "\nFull error can be found here:\n", error);
            break;
    }
    return;
}
function handleCustomError(res, error, errorMessage) {
    switch (error.type) {
        // --- Specific case ---
        // Token valid but user not in database
        case custom_error_1.CUSTOM_ERROR_TYPE.PERMISSION_DENIED:
            res.status(variables_1.CODE_STATUS.UNAUTHORIZED).json({
                "message": "You are not allowed to do this."
            });
            break;
        case custom_error_1.CUSTOM_ERROR_TYPE.USER_NOT_FOUND_BUT_AUTHENTICATED:
            res.status(variables_1.CODE_STATUS.UNAUTHORIZED).json({
                "message": "You are not allowed to do this."
            });
            console.error(error.message);
            break;
        case custom_error_1.CUSTOM_ERROR_TYPE.ACTION_NOT_FOUND:
            res.status(variables_1.CODE_STATUS.NOT_FOUND).json({
                "message": "The action cannot be found."
            });
            console.error(error.message);
            break;
        // 400 code
        case custom_error_1.CUSTOM_ERROR_TYPE.BAD_PARAMETER:
        case custom_error_1.CUSTOM_ERROR_TYPE.AVATAR_INCORRECT_FILE_TYPE:
        case custom_error_1.CUSTOM_ERROR_TYPE.USERNAME_TOO_MUCH_CHARACTERS:
        case custom_error_1.CUSTOM_ERROR_TYPE.USERNAME_INCORRECT_CHARACTERS:
        case custom_error_1.CUSTOM_ERROR_TYPE.USER_NOT_FOUND:
        default:
            res.status(variables_1.CODE_STATUS.BAD_REQUEST).json({
                "message": error.message
            });
            break;
    }
}
function handleRequestError(res, error, errorMessages) {
    if (error instanceof sequelize_1.Error)
        return handleSequelizeErrors(res, error, errorMessages);
    if (error instanceof custom_error_1.default)
        return handleCustomError(res, error, errorMessages);
    res.status(variables_1.CODE_STATUS.INTERNAL).json({
        "message": "An internal error occurred..."
    });
    if (errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.logMessage) {
        console.error("An error occurred with a custom message: ", errorMessages.logMessage);
    }
    else {
        console.error("A NON-SEQUELIZE error occurred: ", error);
    }
    return;
}
