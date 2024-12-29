import {Router} from 'express';
import {file} from "@middlewares/upload-picture";
import checkAuthentication from "@middlewares/check-authentication";
import changeActionStatus, {
    approveAction,
    validateAction
} from "@controllers/action/validate";
import {hasPermissionsOf, hasRole} from "@middlewares/has-role";
import {ROLE} from "@config/variables";
import assignActions from "@controllers/action/assign";
import createAction from "@controllers/action/create";
import {getPendingApprovalActions} from "@controllers/action/fetch";

const actionRouter = Router();

actionRouter.post('/create', checkAuthentication, hasRole(ROLE.ADMIN), createAction);
actionRouter.post('/assign-all', checkAuthentication, hasRole(ROLE.ADMIN), assignActions);
actionRouter.patch('/edit/:id', checkAuthentication, hasRole(ROLE.ADMIN), file('proofPicture', 'uploads/actions/'), changeActionStatus);
actionRouter.patch('/validate-current', checkAuthentication, file('proofPicture', 'uploads/actions/'), validateAction);
actionRouter.post('/:id/approve-action', checkAuthentication, hasPermissionsOf(ROLE.ORGANISER), approveAction);
actionRouter.get('/pending-approval', checkAuthentication, hasPermissionsOf(ROLE.ORGANISER), getPendingApprovalActions);

export default actionRouter;
