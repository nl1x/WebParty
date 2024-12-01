"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTOM_ERROR_TYPE = void 0;
var CUSTOM_ERROR_TYPE;
(function (CUSTOM_ERROR_TYPE) {
    CUSTOM_ERROR_TYPE[CUSTOM_ERROR_TYPE["USER_NOT_FOUND_BUT_AUTHENTICATED"] = 0] = "USER_NOT_FOUND_BUT_AUTHENTICATED";
})(CUSTOM_ERROR_TYPE || (exports.CUSTOM_ERROR_TYPE = CUSTOM_ERROR_TYPE = {}));
class CustomError {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}
exports.default = CustomError;
