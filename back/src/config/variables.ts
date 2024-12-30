import dotenv from "dotenv";

dotenv.config({ path: '../../../.env' });

enum CODE_STATUS {
    SUCCESS=200,
    REDIRECT=301,
    BAD_REQUEST=400,
    UNAUTHORIZED=401,
    NOT_FOUND=404,
    INTERNAL=500
}

const AUTHORIZED_FILE_TYPES = {
    IMAGES: [
        "image/webp",
        "image/png",
        "image/jpg",
        "image/jpeg"
    ]
}

const VAR_LENGTH = {
    USERNAME: parseInt(process.env.USERNAME_MAX_LENGTH || '16'),
    DISPLAY_NAME: parseInt(process.env.DISPLAY_NAME_MAX_LENGTH || '16'),
    ROLE_NAME: parseInt(process.env.ROLE_NAME_MAX_LENGTH || '16'),
    ACTION: parseInt(process.env.ACTION_MAX_LENGTH || '128'),
    PICTURE: parseInt(process.env.PICTURE_MAX_LENGTH || '64'),
    ACTION_STATUS: 16,
    PASSWORD: 128
}

const REGEX = {
    USERNAME_RULES: /^[a-zA-Z0-9_-]+$/
}

const DEFAULT = {
    AVATAR_PLACEHOLDER: '/assets/avatar_placeholder.png',
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT ?? '10'),
    JWT_SECRET: process.env.JWT_SECRET ?? 'th15_iS_Th3_d3Faù1t_S3c4eT_!',
    ENVIRONMENT: process.env.ENVIRONMENT ?? 'development',
    UPLOAD_DIR: process.env.UPLOAD_DIR ?? '/tmp/',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? 'admin',
    ADMIN_DISPLAY_NAME: process.env.ADMIN_USERNAME ?? 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? 'admin'
}

enum SEQUELIZE_ERRORS {
    UNIQUE_CONSTRAINT="SequelizeUniqueConstraintError",
    VALIDATION="SequelizeValidationError",
    DATABASE="SequelizeDatabaseError",
    CONNECTION_REFUSED="SequelizeConnectionRefusedError",
}

enum ROLE {
    ADMIN,
    ORGANISER,
    USER,
}

enum ACTION_STATUS {
    WAITING='waiting',
    PENDING_APPROVAL='pending-approval',
    NOT_DONE='not-done',
    DONE='done'
}

export {
    CODE_STATUS,
    AUTHORIZED_FILE_TYPES,
    VAR_LENGTH,
    REGEX,
    DEFAULT,
    SEQUELIZE_ERRORS,
    ROLE,
    ACTION_STATUS
};
