import multer from "multer";

export function file(fieldName: string, destination: string) {

    const storage = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destination);
            },
            filename: function (req, file, cb) {
                cb(null, `temp_${Date.now()}_${file.originalname}`);
            }
        })
    })

    return storage.single(fieldName);
}
