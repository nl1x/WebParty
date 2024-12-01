import bcrypt from "bcryptjs";
import { DEFAULT } from "@config/variables";

export default function hashPassword(password: string) : Promise<string>
{
    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await bcrypt.hash(password, DEFAULT.BCRYPT_SALT);
            resolve(hashedPassword);
        } catch (error) {
            console.error('Error hashing password:', error);
            reject(error);
        }
    });
}