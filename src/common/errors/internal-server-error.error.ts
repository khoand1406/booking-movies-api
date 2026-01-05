import { BaseError } from "./error.base";

export class InternalServerError extends BaseError{
    constructor(message: string = 'Internal Server Error'){
        super('INTERNAL_SERVER_ERROR', message, 500);
    }
}