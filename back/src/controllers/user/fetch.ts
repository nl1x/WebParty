import User from "@models/user";
import { Request, Response } from 'express';
import {CODE_STATUS} from "@config/variables";
import handleRequestErrors from "@errors/sequelize";

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
           handleRequestErrors(res, error);
        });
}