import {Request, Response} from "express";
import UserAction from "@models/user-action";
import handleRequestError from "@errors/sequelize";
import {AuthenticatedRequest} from "@utils/token";
import {ACTION_STATUS, CODE_STATUS, ROLE} from "@config/variables";
import CustomError, {CUSTOM_ERROR_TYPE} from "@errors/custom-error";
import {checkFileAsImage, deleteFile, saveActionProofFile} from "@utils/avatar";
import Action from "@models/action";
import User from "@models/user";

async function checkUserPermissions(user: User, res: Response)
{
    const hasPermissions = await user.hasPermission(ROLE.ORGANISER);
    if (!hasPermissions) {
        handleRequestError(res, new CustomError(CUSTOM_ERROR_TYPE.PERMISSION_DENIED));
        return false;
    }
    return true;
}

async function checkProofPicture(res: Response, proofPicture: Express.Multer.File|undefined, userAction: UserAction) : Promise<boolean>
{
    // Check if the picture is an image
    if (proofPicture) {
        const proofPictureError = checkFileAsImage(proofPicture);
        if (proofPictureError instanceof CustomError) {
            deleteFile(proofPicture);
            handleRequestError(res, proofPictureError);
            return false;
        }
        await saveActionProofFile(userAction, proofPicture.path);
        return true;
    }
    handleRequestError(
        res,
        new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "The proof picture is missing."
        )
    );
    return false;
}

async function changeToPendingForApproval(currentAction: UserAction, proofPicture: Express.Multer.File|undefined, res: Response)
{
    const isProofPictureValid = await checkProofPicture(res, proofPicture, currentAction);
    if (!isProofPictureValid)
        return;

    currentAction.status = ACTION_STATUS.PENDING_APPROVAL;

    try {
        await currentAction.save();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        "message": "The action is waiting for approval..."
    });
}

export async function validateAction(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const { isDone } = req.body;
    const proofPicture = req.file;
    let currentAction = null;
    let actionsId = authReq.user.getActionsId();

    if (authReq.user.currentActionIndex >= actionsId.length) {
        deleteFile(proofPicture);
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.ACTION_NOT_FOUND,
            "You don't have any action to do."
        ));
    }

    try {
        currentAction = await UserAction.findByPk(
            actionsId[authReq.user.currentActionIndex],
            {
                include: [{
                    model: Action,
                    as: 'action'
                }]
            }
        );
    } catch (error) {
        deleteFile(proofPicture);
        return handleRequestError(res, error);
    }

    if (!currentAction || !currentAction.action) {
        deleteFile(proofPicture);
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.ACTION_NOT_FOUND,
            "Your current action cannot be found."
        ));
    }

    if (!currentAction.action.requireProof)
        deleteFile(proofPicture);

    if (!isDone) {
        currentAction.status = ACTION_STATUS.NOT_DONE;
    } else if (currentAction.action.requireProof) {
        return changeToPendingForApproval(currentAction, proofPicture, res)
    } else {
        currentAction.status = ACTION_STATUS.DONE;
    }

    authReq.user.currentActionIndex++;

    try {
        await currentAction.save();
        await authReq.user.save();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        message: `The action has been set as ${isDone ? 'done' : 'not done'}.`
    });
}

export async function approveAction(req: Request, res: Response)
{
    const { id: userActionId } = req.params;
    const { isApproved } = req.body;
    const parsedUserActionId = parseInt(userActionId, 10);
    let userAction = null;

    try {
        userAction = await UserAction.findByPk(parsedUserActionId);
    } catch (error) {
        return handleRequestError(res, error);
    }

    if (userAction === null) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "This user action cannot be found."
        ));
    }

    if (userAction.status !== ACTION_STATUS.PENDING_APPROVAL) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.BAD_PARAMETER,
            "This action is not pending for approval."
        ));
    }

    userAction.status = isApproved ? ACTION_STATUS.DONE : ACTION_STATUS.NOT_DONE;

    let user = null;

    try {
        user = await User.findByPk(userAction.userId);
    } catch (error) {
        return handleRequestError(res, error);
    }

    if (!user) {
        return handleRequestError(res, new CustomError(
            CUSTOM_ERROR_TYPE.ACTION_NOT_FOUND,
            "This user action does not exist."
        ));
    }

    user.currentActionIndex++;

    try {
        await userAction.save();
        await user.save();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        message: `The action has${isApproved ? '' : ' not'} been approved.`
    });
}

export default async function changeActionStatus(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const { id } = req.params;
    const { userId, status } = req.body;
    const proofPicture = req.file;
    const actionId = parseInt(id, 10);
    const targetId = userId ? parseInt(userId, 10) : authReq.user.id;
    let userAction = null;
    let action = null;

    try {
        if (userId) {
            const hasPermissions = await checkUserPermissions(authReq.user, res);
            if (!hasPermissions)
                return;
        }

        userAction = await UserAction.findOne({
            where: {
                userId: targetId,
                actionId: actionId
            }
        })
        action = await Action.findByPk(actionId);
    } catch (error) {
        return handleRequestError(res, error);
    }

    if (userAction === null || action === null) {
        return handleRequestError(
            res,
            new CustomError(
                CUSTOM_ERROR_TYPE.ACTION_NOT_FOUND,
                `The action with id [${targetId}, ${actionId}] cannot be found.`
            )
        );
    }

    if (![ACTION_STATUS.DONE, ACTION_STATUS.NOT_DONE, ACTION_STATUS.PENDING_APPROVAL, ACTION_STATUS.WAITING].includes(status)) {
        return handleRequestError(res, new CustomError(CUSTOM_ERROR_TYPE.BAD_PARAMETER, `The status '${status}' is invalid.`));
    }

    if (action.requireProof) {
        let _continue = true;

        switch (status) {
            // The user has sent the proof and wait for a validation
            case ACTION_STATUS.PENDING_APPROVAL:
                _continue = await checkProofPicture(res, proofPicture, userAction);
                break;
            // The organiser did not validate the proof picture
            case ACTION_STATUS.NOT_DONE:
            case ACTION_STATUS.WAITING:
                if (proofPicture) {
                    deleteFile(proofPicture);
                }
                if (userAction.proofPicture) {
                    deleteFile(userAction.proofPicture);
                    userAction.proofPicture = null;
                }
                break;
            case ACTION_STATUS.DONE:
                if (proofPicture) {
                    deleteFile(proofPicture);
                }
                _continue = await checkUserPermissions(authReq.user, res);// && await selectNextAction(authReq.user, res);
                break;
        }

        if (!_continue) {
            return;
        }
    }

    userAction.status = status;

    try {
        await userAction.save();
    } catch (error) {
        return handleRequestError(res, error);
    }

    res.status(CODE_STATUS.SUCCESS).json({
        message: `Action set as '${status}'.`
    });
}
