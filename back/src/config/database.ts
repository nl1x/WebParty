import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const HOST = process.env.DATABASE_HOST || "";
const USER = process.env.DATABASE_USER || "";
const PASSWORD = process.env.DATABASE_PASSWORD || "";
const DATABASE = process.env.DATABASE_DB || "";

const database = new Sequelize(DATABASE, USER, PASSWORD, {
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

export default database;
