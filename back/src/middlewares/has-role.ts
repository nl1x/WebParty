import {ROLE} from "@config/variables";
import {Request, Response, NextFunction} from "express";
import {AuthenticatedRequest, decodeToken} from "@utils/token";
import Roles from "@config/roles";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";

export function hasRole(role: ROLE)
{
    const requiredRole = Roles[role];

    return async function (req: Request, res: Response, next: NextFunction) {
        const authReq = req as AuthenticatedRequest;

        if (authReq.user.roleName !== requiredRole.name) {
            return handleRequestError(
                res,
                new CustomError(CUSTOM_ERROR_TYPE.PERMISSION_DENIED)
            );
        }
        next();
    }
}

export function hasPermissionsOf(role: ROLE)
{
    const requiredRole = Roles[role];

    return async function (req: Request, res: Response, next: NextFunction) {
        const authReq = req as AuthenticatedRequest;

        if (!authReq.user.role?.weight || authReq.user.role.weight < requiredRole.weight) {
            return handleRequestError(
                res,
                new CustomError(CUSTOM_ERROR_TYPE.PERMISSION_DENIED)
            );
        }
        next();
    }
}