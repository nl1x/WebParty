import { DataTypes, Model, Sequelize } from 'sequelize';
import {VAR_LENGTH} from "@config/variables";
import ROLES from "@config/roles";

class Role extends Model {
    declare name: string;
    declare displayName: string;
    declare weight: number;
}

export async function initRoleModel(database: Sequelize)
{
    Role.init(
        {
            name: {
                type: DataTypes.STRING(VAR_LENGTH.ROLE_NAME),
                unique: true,
                primaryKey: true
            },
            displayName: {
                type: DataTypes.STRING(VAR_LENGTH.USERNAME)
            },
            weight: {
                type: DataTypes.INTEGER
            }
        },
        {
            sequelize: database,
            modelName: 'Role',
            timestamps: false
        }
    );
}

export const initRoles = async () => {
    for (let i = 0; i < ROLES.length; i++) {
        const role = ROLES[i];

        await Role.findOrCreate(
            {
                where: { name: role.name },
                defaults: {
                    name: role.name,
                    displayName: role.displayName,
                    weight: role.weight
                },
            }
        );
    }
}

export default Role;
