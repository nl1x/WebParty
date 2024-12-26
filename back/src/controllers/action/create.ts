import {Request, Response} from "express";
import handleRequestError from "@errors/sequelize";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import Action from "@models/action";
import {CODE_STATUS} from "@config/variables";


export default async function createAction(req: Request, res: Response)
{
    const { difficulty, requireProof, description } = req.body;
    const parsedDifficulty = parseInt(difficulty, 10);

    if (parsedDifficulty < 1 || parsedDifficulty > 3) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "The difficulty should be between 1 and 3."
        ));
    }

    if (!description) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "The description is missing."
        ));
    }

    let action = null;

    try {
        action = await Action.create({
            description,
            difficulty: parsedDifficulty,
            requireProof: requireProof
        });
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        message: "The action has been successfully created.",
        actionId: action.id
    });

}