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
            amountPerUser: 6
        },
        {
            actions: mediumActions,
            amountPerUser: 4
        },
        {
            actions: hardActions,
            amountPerUser: 2
        }
    ];

    try {
        // WARNING: Réinitialise toutes les actions assignées.
        await UserAction.destroy({ where: {} });
    } catch (error) {
        return handleRequestError(res, error);
    }

    // This code part is scarily ugly... :')
    for (const setting of settings) {
        if (setting.actions.length === 0)
            continue;

        let i = 0;
        setting.actions = shuffle(setting.actions);

        for (const user of users) {
            for (let j = 0; j < setting.amountPerUser && j < setting.actions.length; j++) {

                if (i >= setting.actions.length)
                    i = 0;

                try {
                    await UserAction.create({
                        userId: user.id,
                        actionId: setting.actions[i].id,
                        requireProof: setting.actions[i].requireProof
                    });
                    i++;
                } catch (error) {
                    return handleRequestError(res, error);
                }
            }
        }
    }

    res.status(CODE_STATUS.SUCCESS).json({
        message: "All actions have been correctly set."
    });
}
