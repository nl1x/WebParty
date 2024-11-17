"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = file;
const multer_1 = __importDefault(require("multer"));
function file(fieldName, destination) {
    const storage = (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destination);
            },
            filename: function (req, file, cb) {
                cb(null, `temp_${Date.now()}_${file.originalname}`);
            }
        })
    });
    return storage.single(fieldName);
}
