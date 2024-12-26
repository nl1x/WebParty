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
exports.initUserActionModel = initUserActionModel;
const sequelize_1 = require("sequelize");
const variables_1 = require("@config/variables");
const action_1 = __importDefault(require("@models/action"));
const user_1 = __importDefault(require("@models/user"));
class UserAction extends sequelize_1.Model {
}
function initUserActionModel(database) {
    return __awaiter(this, void 0, void 0, function* () {
        UserAction.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: user_1.default,
                    key: 'id'
                },
            },
            actionId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: action_1.default,
                    key: 'id'
                },
            },
            proofPicture: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.PICTURE),
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.ACTION_STATUS),
                defaultValue: variables_1.ACTION_STATUS.WAITING,
                allowNull: false
            },
        }, {
            sequelize: database,
            modelName: 'UserAction',
            timestamps: false
        });
    });
}
exports.default = UserAction;
