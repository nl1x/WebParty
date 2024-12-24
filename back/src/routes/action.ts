import {Router} from 'express';
import {file} from "@middlewares/upload-picture";
import checkAuthentication from "@middlewares/check-authentication";
import changeActionStatus from "@controllers/action/validate";
import {hasRole} from "@middlewares/has-role";
import {ROLE} from "@config/variables";
import assignActions from "@controllers/action/assign";
import createAction from "@controllers/action/create";

const actionRouter = Router();

actionRouter.post('/create', checkAuthentication, hasRole(ROLE.ADMIN), createAction);
actionRouter.post('/assign-all', checkAuthentication, hasRole(ROLE.ADMIN), assignActions);
actionRouter.patch('/edit/:id', checkAuthentication, file('proofPicture', 'uploads/actions/'), changeActionStatus);

export default actionRouter;
