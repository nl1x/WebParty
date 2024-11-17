"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const HOST = process.env.DATABASE_HOST || "";
const USER = process.env.DATABASE_USER || "";
const PASSWORD = process.env.DATABASE_PASSWORD || "";
const DATABASE = process.env.DATABASE_DB || "";
const database = new sequelize_1.Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: 'mysql'
});
// Login to the database
database.authenticate()
    .then(() => console.log('Successfully connected to the database.'))
    .catch((error) => console.error('An error occurred while connecting to the database: ', error));
// Sync tables
database.sync({ force: true })
    .then(() => {
    console.log('All models were synchronized successfully.');
})
    .catch((error) => {
    console.error('An error occurred while synchronizing the database: ', error);
});
exports.default = database;
