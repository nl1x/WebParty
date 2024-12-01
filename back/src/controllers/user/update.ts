import { Request, Response } from 'express';
import { AuthenticatedRequest } from "@utils/token";

export default async function updateUser(req: Request, res: Response)
{
    const authReq = req as AuthenticatedRequest;
    const { username, password } = authReq.body;
    const avatar = authReq.file;

    if (password)
        authReq.user.password = password;
    if (username)
        authReq.user.username = username;
    if (avatar)
        // set avatar after checking its correct
        return;

    // TODO : Finish this part...

}