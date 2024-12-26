import { Request, Response } from 'express';
import { AuthenticatedRequest } from "@utils/token";
import handleRequestError from "@errors/sequelize";
import {CODE_STATUS} from "@config/variables";
import User from "@models/user";

export async function deleteUser(req: Request, res: Response)
{
    const { userId } = req.body;

    try {
        await User.destroy({where: { id: userId }});
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "message": `The account with ID '${userId}' has been deleted.`
    });
}

export async function deleteMe(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const user = authReq.user;

    try {
        await user.destroy();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "message": `The account with ID '${user.id}' (${user.username}) has been deleted.`
    });
}
