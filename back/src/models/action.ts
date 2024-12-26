import { DataTypes, Model, Sequelize } from 'sequelize';
import { VAR_LENGTH } from "@config/variables";

class Action extends Model {
    declare id: number;
    declare description: string;
    declare difficulty: number;
    declare requireProof: boolean;
}

export async function initActionModel(database: Sequelize) {
    Action.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            description: {
                type: DataTypes.STRING(VAR_LENGTH.ACTION)
            },
            difficulty: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            requireProof: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        },
        {
            sequelize: database,
            modelName: 'Action',
            timestamps: false
        }
    );
}

export async function initActions()
{
    for (let i = 0; i < 72; i++) {
        await Action.findOrCreate({
            where: {
                description: `EASY_${i}`,
                difficulty: 1
            }
        });
    }
    for (let i = 0; i < 46; i++) {
        await Action.findOrCreate({
            where: {
                description: `MEDIUM_${i}`,
                difficulty: 2
            }
        });
    }
    for (let i = 0; i < 16; i++) {
        await Action.findOrCreate({
            where: {
                description: `HARD_${i}`,
                difficulty: 3
            }
        });
    }
}

export default Action;
