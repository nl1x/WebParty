import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import User, { initUserModel } from "@models/user";
import Role, { initRoleModel, initRoles } from "@models/role";
import Action, { initActionModel, initActions } from "@models/action";
import UserAction, { initUserActionModel } from "@models/user-action";

dotenv.config();

const HOST = process.env.DATABASE_HOST || "";
const USER = process.env.DATABASE_USER || "";
const PASSWORD = process.env.DATABASE_PASSWORD || "";
const DATABASE = process.env.DATABASE_DB || "";

const database = new Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: 'mysql'
});

export async function initializeDatabase() {
    // Login to the database
    try {
        await database.authenticate();
        console.log('Successfully connected to the database.');
    } catch (error) {
        console.error('An error occurred while connecting to the database: ', error);
    }

    await initRoleModel(database);
    await initUserModel(database);
    await initActionModel(database);
    await initUserActionModel(database);

    User.hasMany(UserAction, {
        foreignKey: 'userId',
        sourceKey: 'id',
        as: 'actions'
    });

    UserAction.belongsTo(User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'user'
    });

    Action.hasMany(UserAction, {
        foreignKey: 'actionId',
        sourceKey: 'id',
        as: 'actions'
    });

    UserAction.belongsTo(Action, {
        foreignKey: 'actionId',
        targetKey: 'id',
        as: 'action'
    });

    User.belongsTo(Role, {
        foreignKey: 'roleName',
        targetKey: 'name',
        as: 'role'
    });

    Role.hasMany(User, {
        foreignKey: 'roleName',
        sourceKey: 'name',
        as: 'role'
    });

    // Sync tables
    try {
        await database.sync({ alter: true }) // Use 'force: true' to fully reset the database, or 'alter: true' to keep data
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('An error occurred while synchronizing the database: ', error);
    }

    // Create roles
    await initRoles();
    await initActions();

}

export default database;
