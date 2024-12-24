import {NextFunction, Request, Response} from 'express';
import {CODE_STATUS} from "@config/variables";
import {AuthenticatedRequest, decodeToken} from "@utils/token";
import User from "@models/user";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import Role from "@models/role";

export default async function checkAuthentication(req: Request, res: Response, next: NextFunction)
{
    const authToken = req.headers.authorization;

    const decodedToken = authToken ? decodeToken(authToken) : null;

    if (decodedToken === null) {
        res.status(CODE_STATUS.UNAUTHORIZED).json({
            "message": "You are not authorized to perform this action."
        });
        return;
    }

    const user = await User.findByPk(
        decodedToken.id,
        {
            attributes: {
                exclude: ['password']
            }
        }
    );

    if (user === null) {
        return handleRequestError(
            res,
            new CustomError(
                CUSTOM_ERROR_TYPE.USER_NOT_FOUND_BUT_AUTHENTICATED,
                `The user with ID '${decodedToken.id}' cannot be found when checking the user authentication token.`
            )
        )
    }

    (req as AuthenticatedRequest).id = decodedToken.id;
    (req as AuthenticatedRequest).user = user;
    next();
}