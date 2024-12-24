"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.initializeDatabase = initializeDatabase;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const user_1 = __importStar(require("@models/user"));
const role_1 = __importStar(require("@models/role"));
const action_1 = __importStar(require("@models/action"));
const user_action_1 = __importStar(require("@models/user-action"));
dotenv_1.default.config();
const HOST = process.env.DATABASE_HOST || "";
const USER = process.env.DATABASE_USER || "";
const PASSWORD = process.env.DATABASE_PASSWORD || "";
const DATABASE = process.env.DATABASE_DB || "";
const database = new sequelize_1.Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: 'mysql'
});
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Login to the database
        try {
            yield database.authenticate();
            console.log('Successfully connected to the database.');
        }
        catch (error) {
            console.error('An error occurred while connecting to the database: ', error);
        }
        yield (0, role_1.initRoleModel)(database);
        yield (0, user_1.initUserModel)(database);
        yield (0, action_1.initActionModel)(database);
        yield (0, user_action_1.initUserActionModel)(database);
        user_1.default.hasMany(user_action_1.default, {
            foreignKey: 'userId',
            sourceKey: 'id',
            as: 'actions'
        });
        user_action_1.default.belongsTo(user_1.default, {
            foreignKey: 'userId',
            targetKey: 'id'
        });
        action_1.default.hasMany(user_action_1.default, {
            foreignKey: 'actionId',
            sourceKey: 'id',
            as: 'actions'
        });
        user_action_1.default.belongsTo(action_1.default, {
            foreignKey: 'actionId',
            targetKey: 'id'
        });
        user_1.default.belongsTo(role_1.default, {
            foreignKey: 'roleName',
            targetKey: 'name',
            as: 'role'
        });
        role_1.default.hasMany(user_1.default, {
            foreignKey: 'roleName',
            sourceKey: 'name',
            as: 'role'
        });
        // Sync tables
        try {
            yield database.sync({ alter: true }); // Use 'force: true' to fully reset the database, or 'alter: true' to keep data
            console.log('All models were synchronized successfully.');
        }
        catch (error) {
            console.error('An error occurred while synchronizing the database: ', error);
        }
        // Create roles
        yield (0, role_1.initRoles)();
        yield (0, action_1.initActions)();
    });
}
exports.default = database;
