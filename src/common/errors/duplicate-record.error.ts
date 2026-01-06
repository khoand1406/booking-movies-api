import { BaseError } from "./error.base";

export class DuplicateRecordError extends BaseError{
    constructor(message: string){
        super('DUPLICATE_RECORD', message, 409);
    }
}