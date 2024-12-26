import User from "@models/user";
import {Request, Response} from 'express';
import {CODE_STATUS} from "@config/variables";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import Role from "@models/role";
import UserAction from "@models/user-action";
import Action from "@models/action";
import {AuthenticatedRequest} from "@utils/token";

export async function getUsers(req: Request, res: Response)
{
    let users = null;

    try {
        users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    as: 'role'
                }
            ]
        });
    } catch (error) {
        return handleRequestError(res, error);
    }

    if (!users) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.USER_NOT_FOUND,
            "No user have been found."
        ));
    }

    let action = null;

    // TODO: Partie du code à revoir
    for (const user of users) {
        action = await user.getCurrentAction();
        user.dataValues.action = action;
        delete user.dataValues.actionsId;
        delete user.dataValues.currentActionIndex;
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "users": users
    });
}

export async function getUser(req: Request, res: Response)
{
    const { id: userId } = req.params;

    if (!userId)
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "The parameter 'id' is missing."
        ));

    // Check if the userId is a positive integer
    if (!(/^\d+$/.test(userId)))
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "The parameter 'id' should be a positive integer."
        ));

    const user = await User.findByPk(parseInt(userId), {
        attributes: {
            exclude: ['password']
        },
        include: [
            {
                model: Role,
                as: 'role'
            },
            {
                model: UserAction,
                as: 'actions',
                attributes: { exclude: ['userId', 'actionId'] },
                include: [{
                    model: Action,
                    as: 'action',
                    attributes: { exclude: ['id'] }
                }]
            }]
    });

    if (user === null) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.USER_NOT_FOUND,
            "The requested user cannot be found."
        ));
    }

    user.dataValues.action = await user.getCurrentAction();
    delete user.dataValues.actionsId;
    delete user.dataValues.currentActionIndex;

    res.status(CODE_STATUS.SUCCESS).json({
        "user": user
    });
}

export async function getMe(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;

    try {
        await authReq.user.setActionHistory();
    } catch (error) {
        return handleRequestError(res, error);
    }

    authReq.user.dataValues.action = await authReq.user.getCurrentAction();
    delete authReq.user.dataValues.actionsId;
    delete authReq.user.dataValues.currentActionIndex;

    res.status(CODE_STATUS.SUCCESS).json({
        "me": authReq.user
    });
}
