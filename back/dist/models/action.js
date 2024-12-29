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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initActionModel = initActionModel;
exports.initActions = initActions;
const sequelize_1 = require("sequelize");
const variables_1 = require("@config/variables");
class Action extends sequelize_1.Model {
}
function initActionModel(database) {
    return __awaiter(this, void 0, void 0, function* () {
        Action.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            description: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.ACTION)
            },
            difficulty: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 1
            },
            requireProof: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
        }, {
            sequelize: database,
            modelName: 'Action',
            timestamps: false
        });
    });
}
function initActions() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 72; i++) {
            yield Action.findOrCreate({
                where: {
                    description: `EASY_${i}`,
                    difficulty: 1
                }
            });
        }
        for (let i = 0; i < 46; i++) {
            yield Action.findOrCreate({
                where: {
                    description: `MEDIUM_${i}`,
                    difficulty: 2
                }
            });
        }
        for (let i = 0; i < 16; i++) {
            yield Action.findOrCreate({
                where: {
                    description: `HARD_${i}`,
                    difficulty: 3
                }
            });
        }
    });
}
exports.default = Action;
