import {DataTypes, Deferrable, Model, Sequelize} from 'sequelize';
import {ACTION_STATUS, VAR_LENGTH} from "@config/variables";
import Action from "@models/action";
import User from "@models/user";

class UserAction extends Model {
    declare userId: number;
    declare actionId: number;
    declare proofPicture: string|null;
    declare status: string;
}

export async function initUserActionModel(database: Sequelize) {
    UserAction.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: User,
                    key: 'id'
                },
            },
            actionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: Action,
                    key: 'id'
                },
            },
            proofPicture: {
                type: DataTypes.STRING(VAR_LENGTH.PICTURE),
                allowNull: true
            },
            status: {
                type: DataTypes.STRING(VAR_LENGTH.ACTION_STATUS),
                defaultValue: ACTION_STATUS.WAITING,
                allowNull: false
            },
        },
        {
            sequelize: database,
            modelName: 'UserAction',
            timestamps: false
        }
    );
}

export default UserAction;
