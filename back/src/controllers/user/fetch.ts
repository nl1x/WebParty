import User from "@models/user";
import {Request, Response} from 'express';
import {CODE_STATUS} from "@config/variables";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import {AuthenticatedRequest} from "@utils/token";
import Role from "@models/role";
import UserAction from "@models/user-action";

// ===============================
//   TODO : Review this function
// ===============================
export async function getUsers(req: Request, res: Response)
{
    User.findAll({
        attributes: { exclude: ['password'] },
        include: [
            {model: Role, as: 'role'},
            {model: UserAction, as: 'actions'}
        ]
    })
        .then((users) => {
            res.status(CODE_STATUS.SUCCESS).json({
                "users": users
            });
        })
        .catch((error) => {
           handleRequestError(res, error);
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
        include: [{model: Role, as: 'role'}, {model: UserAction, as: 'actions'}]
    });

    if (user === null) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.USER_NOT_FOUND,
            "The requested user cannot be found."
        ));
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "user": user
    });
}
