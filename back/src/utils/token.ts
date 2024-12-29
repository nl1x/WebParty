import { Request } from 'express';
import User from '@models/user';
import jwt from 'jsonwebtoken';
import { DEFAULT } from "@config/variables";

export interface AuthenticatedRequest extends Request {
    id: number;
    user: User;
}

export default async function generateToken(user: User)
{
    const data = {
        id: user.id
    };

    return jwt.sign(data, DEFAULT.JWT_SECRET);
}

export function decodeToken(token: string) : TokenObject|null
{
    token = token.replace('Bearer ', '');

    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, DEFAULT.JWT_SECRET);
    } catch (error) {
        return null;
    }

    return decodedToken as TokenObject;
}

interface TokenObject {
    id: number;
}
