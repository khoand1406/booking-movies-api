import { BaseError } from "./error.base";

export class BadRequestError extends BaseError{
    constructor(message: string = 'Bad Request'){
        super('BAD_REQUEST', message, 400);
    }
}