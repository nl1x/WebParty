"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT = exports.REGEX = exports.VAR_LENGTH = exports.AUTHORIZED_FILE_TYPES = exports.CODE_STATUS = void 0;
var CODE_STATUS;
(function (CODE_STATUS) {
    CODE_STATUS[CODE_STATUS["SUCCESS"] = 200] = "SUCCESS";
    CODE_STATUS[CODE_STATUS["REDIRECT"] = 301] = "REDIRECT";
    CODE_STATUS[CODE_STATUS["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    CODE_STATUS[CODE_STATUS["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    CODE_STATUS[CODE_STATUS["INTERNAL"] = 500] = "INTERNAL";
})(CODE_STATUS || (exports.CODE_STATUS = CODE_STATUS = {}));
const AUTHORIZED_FILE_TYPES = {
    IMAGES: [
        "image/png",
        "image/jpg",
        "image/jpeg"
    ]
};
exports.AUTHORIZED_FILE_TYPES = AUTHORIZED_FILE_TYPES;
const VAR_LENGTH = {
    USERNAME: parseInt(process.env.USERNAME_MAX_LENGTH || '16')
};
exports.VAR_LENGTH = VAR_LENGTH;
const REGEX = {
    USERNAME_RULES: /^[a-zA-Z0-9_-]+$/
};
exports.REGEX = REGEX;
const DEFAULT = {
    AVATAR_PLACEHOLDER: '/assets/avatar_placeholder.png'
};
exports.DEFAULT = DEFAULT;
