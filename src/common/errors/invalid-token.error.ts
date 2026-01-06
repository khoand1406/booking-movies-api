import { BaseError } from "./error.base";

export class InvalidTokenError extends BaseError{
    constructor(message: string = "Invalid token") {
        super('INVALID_TOKEN', message, 401);
    }
}