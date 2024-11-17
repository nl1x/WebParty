enum CODE_STATUS {
    SUCCESS=200,
    REDIRECT=301,
    BAD_REQUEST=400,
    UNAUTHORIZED=401,
    INTERNAL=500
}

const AUTHORIZED_FILE_TYPES = {
    IMAGES: [
        "image/png",
        "image/jpg",
        "image/jpeg"
    ]
}

const VAR_LENGTH = {
    USERNAME: parseInt(process.env.USERNAME_MAX_LENGTH || '16')
}

const REGEX = {
    USERNAME_RULES: /^[a-zA-Z0-9_-]+$/
}

const DEFAULT = {
    AVATAR_PLACEHOLDER: '/assets/avatar_placeholder.png',
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT || '10')
}

export { CODE_STATUS, AUTHORIZED_FILE_TYPES, VAR_LENGTH, REGEX, DEFAULT };
