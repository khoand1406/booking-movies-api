import { BaseError } from "./error.base";

export class BadCredentialsError extends BaseError{
    constructor(message: string){
        super('BAD_CREDENTIALS', message, 401);
    }
}