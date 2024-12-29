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
exports.initRoles = void 0;
exports.initRoleModel = initRoleModel;
const sequelize_1 = require("sequelize");
const variables_1 = require("@config/variables");
const roles_1 = __importDefault(require("@config/roles"));
class Role extends sequelize_1.Model {
}
function initRoleModel(database) {
    return __awaiter(this, void 0, void 0, function* () {
        Role.init({
            name: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.ROLE_NAME),
                unique: true,
                primaryKey: true
            },
            displayName: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.USERNAME)
            },
            weight: {
                type: sequelize_1.DataTypes.INTEGER
            }
        }, {
            sequelize: database,
            modelName: 'Role',
            timestamps: false
        });
    });
}
const initRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < roles_1.default.length; i++) {
        const role = roles_1.default[i];
        yield Role.findOrCreate({
            where: { name: role.name },
            defaults: {
                name: role.name,
                displayName: role.displayName,
                weight: role.weight
            },
        });
    }
});
exports.initRoles = initRoles;
exports.default = Role;
