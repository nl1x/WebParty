"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("@config/database"));
const variables_1 = require("@config/variables");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.USERNAME),
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    sequelize: database_1.default
});
exports.default = User;
