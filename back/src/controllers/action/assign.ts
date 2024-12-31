import {Request, Response} from "express";
import User from "@models/user";
import Action from "@models/action";
import shuffle from "@utils/shuffle";
import UserAction from "@models/user-action";
import handleRequestError from "@errors/sequelize";
import {CODE_STATUS} from "@config/variables";

export default async function assignActions(req: Request, res: Response)
{
    const users = await User.findAll();

    const easyActions = await Action.findAll({
        where: {
            difficulty: 1
        }
    });
    const mediumActions = await Action.findAll({
        where: {
            difficulty: 2
        }
    });
    const hardActions = await Action.findAll({
        where: {
            difficulty: 3
        }
    });

    const settings = [
        {
            actions: easyActions,
            amountPerUser: 6,
            currentIndex: 0
        },
        {
            actions: mediumActions,
            amountPerUser: 4,
            currentIndex: 0
        },
        {
            actions: hardActions,
            amountPerUser: 2,
            currentIndex: 0
        }
    ];

    try {
        // WARNING: Réinitialise toutes les actions assignées.
        await UserAction.destroy({ where: {} });
    } catch (error) {
        return handleRequestError(res, error);
    }

    // This code part is scarily ugly... :')
    for (const user of users) {
        let userAction = null;
        const actionsId = [];

        for (const setting of settings) {
            if (setting.actions.length === 0)
                continue;

            let actions = setting.actions.filter((action) => {
                const excludedUsers = action.excludedUsersId.split(",");

                return !excludedUsers.includes(user.id.toString());
            });

            actions = shuffle(actions);

            for (let j = 0; j < setting.amountPerUser && j < actions.length; j++) {

                if (j >= actions.length)
                    j = 0;

                try {
                    userAction = await UserAction.create({
                        userId: user.id,
                        actionId: actions[setting.currentIndex].id,
                        requireProof: actions[setting.currentIndex].requireProof,
                        nextUserActionId: null
                    });
                    actionsId.push(userAction.id);
                    setting.currentIndex++;
                } catch (error) {
                    return handleRequestError(res, error);
                }
            }
        }

        user.setActionsId(actionsId);
        try {
            await user.save();
        } catch (error) {
            return handleRequestError(res, error);
        }
    }

    res.status(CODE_STATUS.SUCCESS).json({
        message: "All actions have been correctly set."
    });
}
