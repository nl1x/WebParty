export enum CUSTOM_ERROR_TYPE {
    PERMISSION_DENIED,

    USER_NOT_FOUND_BUT_AUTHENTICATED,
    USER_NOT_FOUND,
    USERNAME_TOO_MUCH_CHARACTERS,
    USERNAME_INCORRECT_CHARACTERS,

    ACTION_NOT_FOUND,

    AVATAR_INCORRECT_FILE_TYPE,
    BAD_PARAMETER
}

export default class CustomError {

    readonly type: CUSTOM_ERROR_TYPE;
    readonly message: string;

    constructor(type: CUSTOM_ERROR_TYPE, message?: string) {
        this.type = type;
        this.message = message ?? "";
    }

}
