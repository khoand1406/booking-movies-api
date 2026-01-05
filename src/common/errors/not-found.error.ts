import { BaseError } from "./error.base";

export class NotFoundError extends BaseError{
    constructor(message: string = 'Resource Not Found'){
        super('NOT_FOUND', message, 404);
    }
}