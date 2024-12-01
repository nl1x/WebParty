"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
const variables_1 = require("@config/variables");
class ErrorMessages {
    constructor(props) {
        this.uniqueConstraint = props.uniqueConstraint;
        this.validation = props.validation;
    }
    getErrorMessage(error) {
        const dispatcher = {
            Error: (err) => this.getSequelizeErrorMessage(err),
            String: (err) => this.getStringErrorMessage(err),
        };
        const key = error.constructor.name;
        const handler = dispatcher[key];
        if (!handler) {
            return "An unknown error occurred.";
        }
        return handler(error);
    }
    getErrorCode(error) {
        const dispatcher = {
            Error: (err) => this.getSequelizeErrorCode(err),
            String: (err) => this.getStringErrorCode(err),
        };
        const key = error.constructor.name;
        const handler = dispatcher[key];
        if (!handler) {
            return 500;
        }
        return handler(error);
    }
    getSequelizeErrorMessage(error) {
        switch (error.name) {
            case variables_1.SEQUELIZE_ERRORS.UNIQUE_CONSTRAINT:
                return this.uniqueConstraint;
            case variables_1.SEQUELIZE_ERRORS.VALIDATION:
                return this.validation;
            case variables_1.SEQUELIZE_ERRORS.DATABASE:
            default:
                return "An internal error occurred...";
        }
    }
    getStringErrorMessage(error) {
        switch (error) {
            case "test":
                return 'test4';
            case "test2":
                return "test3";
        }
        return "An unknown error occurred.";
    }
    getSequelizeErrorCode(error) {
        switch (error.name) {
            case variables_1.SEQUELIZE_ERRORS.VALIDATION:
            case variables_1.SEQUELIZE_ERRORS.UNIQUE_CONSTRAINT:
                return 400;
            case variables_1.SEQUELIZE_ERRORS.DATABASE:
            default:
                return 500;
        }
    }
    getStringErrorCode(error) {
        switch (error) {
            case "test1":
            case "test2":
                return 400;
            case "test3":
            default:
                return 500;
        }
    }
}
exports.ErrorMessages = ErrorMessages;
