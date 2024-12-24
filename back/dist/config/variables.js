"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_STATUS = exports.ROLE = exports.SEQUELIZE_ERRORS = exports.DEFAULT = exports.REGEX = exports.VAR_LENGTH = exports.AUTHORIZED_FILE_TYPES = exports.CODE_STATUS = void 0;
var CODE_STATUS;
(function (CODE_STATUS) {
    CODE_STATUS[CODE_STATUS["SUCCESS"] = 200] = "SUCCESS";
    CODE_STATUS[CODE_STATUS["REDIRECT"] = 301] = "REDIRECT";
    CODE_STATUS[CODE_STATUS["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    CODE_STATUS[CODE_STATUS["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    CODE_STATUS[CODE_STATUS["NOT_FOUND"] = 404] = "NOT_FOUND";
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
    USERNAME: parseInt(process.env.USERNAME_MAX_LENGTH || '16'),
    DISPLAY_NAME: parseInt(process.env.DISPLAY_NAME_MAX_LENGTH || '16'),
    ROLE_NAME: parseInt(process.env.ROLE_NAME_MAX_LENGTH || '16'),
    ACTION: parseInt(process.env.ACTION_MAX_LENGTH || '128'),
    PICTURE: parseInt(process.env.PICTURE_MAX_LENGTH || '64'),
    ACTION_STATUS: 16,
    PASSWORD: 128
};
exports.VAR_LENGTH = VAR_LENGTH;
const REGEX = {
    USERNAME_RULES: /^[a-zA-Z0-9_-]+$/
};
exports.REGEX = REGEX;
const DEFAULT = {
    AVATAR_PLACEHOLDER: '/assets/avatar_placeholder.png',
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT || '10'),
    JWT_SECRET: process.env.JWT_SECRET || 'th15_iS_Th3_d3Faù1t_S3c4eT_!',
};
exports.DEFAULT = DEFAULT;
var SEQUELIZE_ERRORS;
(function (SEQUELIZE_ERRORS) {
    SEQUELIZE_ERRORS["UNIQUE_CONSTRAINT"] = "SequelizeUniqueConstraintError";
    SEQUELIZE_ERRORS["VALIDATION"] = "SequelizeValidationError";
    SEQUELIZE_ERRORS["DATABASE"] = "SequelizeDatabaseError";
    SEQUELIZE_ERRORS["CONNECTION_REFUSED"] = "SequelizeConnectionRefusedError";
})(SEQUELIZE_ERRORS || (exports.SEQUELIZE_ERRORS = SEQUELIZE_ERRORS = {}));
var ROLE;
(function (ROLE) {
    ROLE[ROLE["ADMIN"] = 0] = "ADMIN";
    ROLE[ROLE["ORGANISER"] = 1] = "ORGANISER";
    ROLE[ROLE["USER"] = 2] = "USER";
})(ROLE || (exports.ROLE = ROLE = {}));
var ACTION_STATUS;
(function (ACTION_STATUS) {
    ACTION_STATUS["WAITING"] = "waiting";
    ACTION_STATUS["PENDING_APPROVAL"] = "pending-approval";
    ACTION_STATUS["NOT_DONE"] = "not-done";
    ACTION_STATUS["DONE"] = "done";
})(ACTION_STATUS || (exports.ACTION_STATUS = ACTION_STATUS = {}));
