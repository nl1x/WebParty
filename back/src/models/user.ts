import {DataTypes, Model} from 'sequelize';
import database from "@config/database";

class User extends Model {
    declare id: number;
    declare password: string;
    declare username: string;
    declare avatarUrl: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(16),
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        avatarUrl: {
            type: DataTypes.STRING
        },
    },
    {
        sequelize: database
    },
);

export default User;
