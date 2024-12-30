import {DataTypes, Model, Sequelize} from 'sequelize';
import {
    ACTION_STATUS,
    DEFAULT,
    ROLE,
    VAR_LENGTH
} from "@config/variables";
import ROLES from "@config/roles";
import Role from "@models/role";
import Roles from "@config/roles";
import UserAction from "@models/user-action";
import Action from "@models/action";
import {deleteFile} from "@utils/avatar";
import hashPassword from "@utils/hash";

class User extends Model {
    declare id: number;
    declare password: string;
    declare username: string;
    declare displayName: string;
    declare avatarUrl: string;
    declare roleName: string;
    declare score: number;
    declare private actionsId: string; // A json string to parse
    declare currentActionIndex: number;
    declare action?: UserAction|null;
    declare history?: UserAction[];
    declare role?: Role;

    public async hasPermission(requiredRole: ROLE) : Promise<boolean>
    {
        let role = null;

        try {
            role = await Role.findByPk(this.roleName);
        } catch (error) {
            throw error;
        }

        return role !== null && role.weight >= Roles[requiredRole].weight;
    }

    public async getCurrentAction() : Promise<UserAction|null>
    {
        const _actionsId = this.getActionsId()

        if (this.currentActionIndex >= _actionsId.length) {
            return null;
        }

        let action = null;

        try {
            action = await UserAction.findByPk(
                _actionsId[this.currentActionIndex],
                {
                    attributes: { exclude: ['userId', 'actionId'] },
                    include: [{
                        model: Action,
                        as: 'action',
                        attributes: { exclude: ['id'] }
                    }]
                }
            );
        } catch (error) {
            throw error;
        }

        return action;
    }

    public async resetActions()
    {
        const _actionsId = this.getActionsId()

        for (let i = 0; i < this.currentActionIndex; i++) {
            let userActionId = _actionsId[i];
            let userAction = await UserAction.findByPk(
                userActionId,
                {
                    attributes: { exclude: ['userId', 'actionId'] },
                    include: [{
                        model: Action,
                        as: 'action',
                        attributes: { exclude: ['id'] }
                    }]
                }
            );

            if (!userAction)
                continue;

            userAction.status = ACTION_STATUS.WAITING;
            if (userAction.proofPicture)
                deleteFile(userAction.proofPicture);

            await userAction.save();
        }
        this.currentActionIndex = 0;
        this.score = 0;

        await this.save();
    }

    public async setActionHistory()
    {
        const _actionsId = this.getActionsId()
        const history = [];

        for (let i = 0; i < this.currentActionIndex; i++) {
            let userActionId = _actionsId[i];
            let userAction = await UserAction.findByPk(
                userActionId,
                {
                    attributes: { exclude: ['userId', 'actionId'] },
                    include: [{
                        model: Action,
                        as: 'action',
                        attributes: { exclude: ['id'] }
                    }]
                }
            );
            if (userAction)
                history.push(userAction);
        }

        this.history = history;
        this.dataValues.history = history;
    }

    public getActionsId() : number[]
    {
        return this.actionsId.split(',').filter(actionId => actionId).map((actionId) => parseInt(actionId));
    }

    public setActionsId(actionsId: number[])
    {
        this.actionsId = actionsId.toString();
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
            displayName: {
                type: DataTypes.STRING(VAR_LENGTH.USERNAME),
                allowNull: false,
                defaultValue: ''
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
            },
            score: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            actionsId: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            currentActionIndex: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }
        },
        {
            sequelize: database, modelName: 'User'
        }
    );
}

export const createAdminUser = async () => {

    const username = DEFAULT.ADMIN_USERNAME;
    const displayName = DEFAULT.ADMIN_DISPLAY_NAME;
    const password = DEFAULT.ADMIN_PASSWORD;

    let hashedPassword: string;
    try {
        hashedPassword = await hashPassword(password);
    } catch (error) {
        console.error("An error occurred while hashing the admin password: ", error);
        return;
    }

    const [user, created] = await User.findOrCreate(
        {
            where: { username: username },
            defaults: {
                username: username,
                displayName: displayName,
                password: hashedPassword
            },
        }
    );

    if (created) {
        user.roleName = Roles[ROLE.ADMIN].name;
        try {
            await user.save();
        } catch (error) {
            console.error("An error occurred while saving the administrator: ", error);
        }
    }
}

export default User;
