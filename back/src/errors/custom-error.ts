export enum CUSTOM_ERROR_TYPE {
    USER_NOT_FOUND_BUT_AUTHENTICATED,
}

export default class CustomError {

    readonly type: CUSTOM_ERROR_TYPE;
    readonly message: string;

    constructor(type: CUSTOM_ERROR_TYPE, message: string) {
        this.type = type;
        this.message = message;
    }

}