import {Request, Response} from 'express';
import User from "@models/user";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import {CODE_STATUS} from "@config/variables";

export default async function resetUserActions(req: Request, res: Response)
{
    const { id } = req.params;
    const userId = parseInt(id, 10);
    let user = null;

    try {
        user = await User.findByPk(userId);
    } catch (error) {
        return handleRequestError(res, error);
    }

    if (!user) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.USER_NOT_FOUND,
            "This user does not exist."
        ));
    }

    await user.resetActions();

    res.status(CODE_STATUS.SUCCESS).json({
        message: "The actions of this user has been reset."
    });
}
