"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("@config/database"));
const variables_1 = require("@config/variables");
class Permission extends sequelize_1.Model {
}
Permission.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.PERMISSION),
        unique: true
    },
}, {
    sequelize: database_1.default
});
exports.default = Permission;
