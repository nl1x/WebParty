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
exports.initUserModel = initUserModel;
const sequelize_1 = require("sequelize");
const variables_1 = require("@config/variables");
const roles_1 = __importDefault(require("@config/roles"));
const role_1 = __importDefault(require("@models/role"));
const roles_2 = __importDefault(require("@config/roles"));
const user_action_1 = __importDefault(require("@models/user-action"));
const action_1 = __importDefault(require("@models/action"));
const avatar_1 = require("@utils/avatar");
class User extends sequelize_1.Model {
    hasPermission(requiredRole) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = null;
            try {
                role = yield role_1.default.findByPk(this.roleName);
            }
            catch (error) {
                throw error;
            }
            return role !== null && role.weight >= roles_2.default[requiredRole].weight;
        });
    }
    getCurrentAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const _actionsId = this.getActionsId();
            if (this.currentActionIndex >= _actionsId.length) {
                return null;
            }
            let action = null;
            try {
                action = yield user_action_1.default.findByPk(_actionsId[this.currentActionIndex], {
                    attributes: { exclude: ['userId', 'actionId'] },
                    include: [{
                            model: action_1.default,
                            as: 'action',
                            attributes: { exclude: ['id'] }
                        }]
                });
            }
            catch (error) {
                throw error;
            }
            return action;
        });
    }
    resetActions() {
        return __awaiter(this, void 0, void 0, function* () {
            const _actionsId = this.getActionsId();
            for (let i = 0; i < this.currentActionIndex; i++) {
                let userActionId = _actionsId[i];
                let userAction = yield user_action_1.default.findByPk(userActionId, {
                    attributes: { exclude: ['userId', 'actionId'] },
                    include: [{
                            model: action_1.default,
                            as: 'action',
                            attributes: { exclude: ['id'] }
                        }]
                });
                if (!userAction)
                    continue;
                userAction.status = variables_1.ACTION_STATUS.WAITING;
                if (userAction.proofPicture)
                    (0, avatar_1.deleteFile)(userAction.proofPicture);
                yield userAction.save();
            }
            this.currentActionIndex = 0;
            yield this.save();
        });
    }
    setActionHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const _actionsId = this.getActionsId();
            const history = [];
            for (let i = 0; i < this.currentActionIndex; i++) {
                let userActionId = _actionsId[i];
                let userAction = yield user_action_1.default.findByPk(userActionId, {
                    attributes: { exclude: ['userId', 'actionId'] },
                    include: [{
                            model: action_1.default,
                            as: 'action',
                            attributes: { exclude: ['id'] }
                        }]
                });
                if (userAction)
                    history.push(userAction);
            }
            this.history = history;
            this.dataValues.history = history;
        });
    }
    getActionsId() {
        return this.actionsId.split(',').filter(actionId => actionId).map((actionId) => parseInt(actionId));
    }
    setActionsId(actionsId) {
        this.actionsId = actionsId.toString();
    }
}
function initUserModel(database) {
    return __awaiter(this, void 0, void 0, function* () {
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
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.PASSWORD)
            },
            avatarUrl: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.PICTURE),
                allowNull: false,
                defaultValue: 'uploads/avatars/placeholder.png'
            },
            roleName: {
                type: sequelize_1.DataTypes.STRING(variables_1.VAR_LENGTH.ROLE_NAME),
                allowNull: false,
                defaultValue: roles_1.default[variables_1.ROLE.USER].name,
                references: {
                    model: role_1.default,
                    key: 'name'
                },
            },
            actionsId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            currentActionIndex: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize: database, modelName: 'User'
        });
    });
}
exports.default = User;
