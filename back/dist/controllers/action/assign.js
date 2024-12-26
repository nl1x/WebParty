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
exports.default = assignActions;
const user_1 = __importDefault(require("@models/user"));
const action_1 = __importDefault(require("@models/action"));
const shuffle_1 = __importDefault(require("@utils/shuffle"));
const user_action_1 = __importDefault(require("@models/user-action"));
const sequelize_1 = __importDefault(require("@errors/sequelize"));
const variables_1 = require("@config/variables");
function assignActions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_1.default.findAll();
        const easyActions = yield action_1.default.findAll({
            where: {
                difficulty: 1
            }
        });
        const mediumActions = yield action_1.default.findAll({
            where: {
                difficulty: 2
            }
        });
        const hardActions = yield action_1.default.findAll({
            where: {
                difficulty: 3
            }
        });
        const settings = [
            {
                actions: easyActions,
                amountPerUser: 6,
                currentIndex: 0
            },
            {
                actions: mediumActions,
                amountPerUser: 4,
                currentIndex: 0
            },
            {
                actions: hardActions,
                amountPerUser: 2,
                currentIndex: 0
            }
        ];
        try {
            // WARNING: Réinitialise toutes les actions assignées.
            yield user_action_1.default.destroy({ where: {} });
        }
        catch (error) {
            return (0, sequelize_1.default)(res, error);
        }
        // This code part is scarily ugly... :')
        for (const user of users) {
            let userAction = null;
            const actionsId = [];
            for (const setting of settings) {
                if (setting.actions.length === 0)
                    continue;
                setting.actions = (0, shuffle_1.default)(setting.actions);
                for (let j = 0; j < setting.amountPerUser && j < setting.actions.length; j++) {
                    if (j >= setting.actions.length)
                        j = 0;
                    try {
                        userAction = yield user_action_1.default.create({
                            userId: user.id,
                            actionId: setting.actions[setting.currentIndex].id,
                            requireProof: setting.actions[setting.currentIndex].requireProof,
                            nextUserActionId: null
                        });
                        actionsId.push(userAction.id);
                        setting.currentIndex++;
                    }
                    catch (error) {
                        return (0, sequelize_1.default)(res, error);
                    }
                }
            }
            user.setActionsId(actionsId);
            try {
                yield user.save();
            }
            catch (error) {
                return (0, sequelize_1.default)(res, error);
            }
        }
        res.status(variables_1.CODE_STATUS.SUCCESS).json({
            message: "All actions have been correctly set."
        });
    });
}
