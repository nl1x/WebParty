import { Request, Response } from 'express';
import { AuthenticatedRequest } from "@utils/token";
import handleRequestError from "@errors/sequelize";
import {CODE_STATUS} from "@config/variables";

export default async function deleteUser(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const user = authReq.user;

    try {
        await user.destroy();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "message": "Your account has been deleted."
    });
}
