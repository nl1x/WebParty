import {Error} from "sequelize";
import {Response} from 'express';
import {CODE_STATUS, SEQUELIZE_ERRORS} from "@config/variables";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";

function handleSequelizeErrors(res: Response, error: Error, errorMessages?: ErrorMessagesProps)
{
    switch (error.name) {
        case SEQUELIZE_ERRORS.UNIQUE_CONSTRAINT:
            res.status(CODE_STATUS.BAD_REQUEST).json({
                "message": errorMessages?.uniqueConstraint ?? "Bad request." // "Username already taken."
            });
            break;
        case SEQUELIZE_ERRORS.VALIDATION:
            res.status(CODE_STATUS.BAD_REQUEST).json({
                "message": errorMessages?.validation ?? "Bad request." // "The validation tests did not pass."
            });
            break;
        case SEQUELIZE_ERRORS.DATABASE:
            res.status(CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("Database error occurred while creating the user: ", error);
            break;
        case SEQUELIZE_ERRORS.CONNECTION_REFUSED:
            res.status(CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            break;
        default:
            res.status(CODE_STATUS.INTERNAL).json({
                "message": "An internal error occurred..."
            });
            console.error("Unknown error occurred while creating the user: ", error.name, "\nFull error can be found here:\n", error);
            break;
    }
    return;
}

function handleCustomError(res: Response, error: CustomError, errorMessage?: ErrorMessagesProps) : void
{
    switch (error.type) {
        case CUSTOM_ERROR_TYPE.USER_NOT_FOUND_BUT_AUTHENTICATED:
            res.status(CODE_STATUS.UNAUTHORIZED).json({
                "message": "You are not authorized to perform this action."
            });
            console.error(error.message);
            break;
        case CUSTOM_ERROR_TYPE.INCORRECT_PARAMETER:
        case CUSTOM_ERROR_TYPE.MISSING_PARAMETER:
        case CUSTOM_ERROR_TYPE.AVATAR_INCORRECT_FILE_TYPE:
        case CUSTOM_ERROR_TYPE.USERNAME_TOO_MUCH_CHARACTERS:
        case CUSTOM_ERROR_TYPE.USERNAME_INCORRECT_CHARACTERS:
        case CUSTOM_ERROR_TYPE.USER_NOT_FOUND:
            res.status(CODE_STATUS.BAD_REQUEST).json({
                "message": error.message
            });
            break;
    }
}

export default function handleRequestError(res: Response, error: Error|CustomError|any, errorMessages?: ErrorMessagesProps) : void
{
    if (error instanceof Error)
        return handleSequelizeErrors(res, error, errorMessages);

    if (error instanceof CustomError)
        return handleCustomError(res, error, errorMessages);

    res.status(CODE_STATUS.INTERNAL).json({
        "message": "An internal error occurred..."
    });
    if (errorMessages?.logMessage) {
        console.error("An error occurred with a custom message: ", errorMessages.logMessage);
    } else {
        console.error("A NON-SEQUELIZE error occurred: ", error);
    }
    return;
}

interface ErrorMessagesProps {
    validation?: string;
    uniqueConstraint?: string;
    logMessage?: string;
}