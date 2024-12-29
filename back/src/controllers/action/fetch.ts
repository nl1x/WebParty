import {Request, Response} from "express";
import UserAction from "@models/user-action";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import {ACTION_STATUS, CODE_STATUS} from "@config/variables";
import Action from "@models/action";
import User from "@models/user";
import Role from "@models/role";

export async function getPendingApprovalActions(req: Request, res: Response)
{
    let userActions = null;

    try {
        userActions = await UserAction.findAll({
            where: {
                status: ACTION_STATUS.PENDING_APPROVAL
            },
            attributes: { exclude: ['userId', 'actionId'] },
            include: [
                {
                    model: Action,
                    as: 'action',
                    attributes: { exclude: ['id'] }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['id', 'password', 'roleName', 'currentActionIndex', 'actionsId'] },
                    include: [{
                        model: Role,
                        as: 'role'
                    }]
                }
            ],
        });
    } catch (error) {
        return handleRequestError(res, error);
    }

    if (userActions === null) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "No action have been found."
        ));
    }


    res.status(CODE_STATUS.SUCCESS).json({
        actions: userActions
    });
}
