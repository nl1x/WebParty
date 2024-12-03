import User from "@models/user";
import {Request, Response} from 'express';
import {CODE_STATUS} from "@config/variables";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import {AuthenticatedRequest} from "@utils/token";

// ===============================
//   TODO : Review this function
// ===============================
export async function getUsers(req: Request, res: Response)
{
    User.findAll({
        attributes: {exclude: ['password']},
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
            CUSTOM_ERROR_TYPE.MISSING_PARAMETER,
            "The parameter 'id' is missing."
        ));

    // Check if the userId is a positive integer
    if (!(/^\d+$/.test(userId)))
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.INCORRECT_PARAMETER,
            "The parameter 'id' should be a positive integer."
        ));

    const user = await User.findByPk(parseInt(userId), {
        attributes: {
            exclude: ['password']
        }
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

export async function getMe(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const { id: userId } = req.body;

    const user = await User.findByPk(userId);

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