import multer from "multer";
import {DEFAULT} from "@config/variables";
import fs from "fs";

async function createDirectoryIfNotExists(dir: string)
{
    try {
        await fs.promises.access(dir);
    } catch (error) {
        await fs.promises.mkdir(dir, { recursive: true });
    }
}

export function file(fieldName: string, destination: string) {

    const storage = multer({
        storage: multer.diskStorage({
            destination: async function (req, file, cb) {
                const finalDestination = DEFAULT.ENVIRONMENT === 'production'
                    ? `${DEFAULT.UPLOAD_DIR}/${destination}`
                    : destination;

                await createDirectoryIfNotExists(finalDestination);
                cb(null, destination);
            },
            filename: async function (req, file, cb) {
                cb(null, `temp_${Date.now()}_${file.originalname}`);
            }
        })
    })

    return storage.single(fieldName);
}
