import {DataTypes, Model, Sequelize} from 'sequelize';
import {ROLE, VAR_LENGTH} from "@config/variables";
import ROLES from "@config/roles";
import Role from "@models/role";
import Roles from "@config/roles";

class User extends Model {
    declare id: number;
    declare password: string;
    declare username: string;
    declare avatarUrl: string;
    declare roleName: string;

    public async hasPermission(requiredRole: ROLE) : Promise<boolean>
    {
        const role = await Role.findByPk(this.roleName);
        return role !== null && role.weight >= Roles[requiredRole].weight;
    }
}

export async function initUserModel(database: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(VAR_LENGTH.USERNAME),
                unique: true
            },
            password: {
                type: DataTypes.STRING(VAR_LENGTH.PASSWORD)
            },
            avatarUrl: {
                type: DataTypes.STRING(VAR_LENGTH.PICTURE),
                allowNull: false,
                defaultValue: 'uploads/avatars/placeholder.png'
            },
            roleName: {
                type: DataTypes.STRING(VAR_LENGTH.ROLE_NAME),
                allowNull: false,
                defaultValue: ROLES[ROLE.USER].name,
                references: {
                    model: Role,
                    key: 'name'
                },
            }
        },
        {
            sequelize: database, modelName: 'User'
        }
    );
}

export default User;
