import { BaseError } from "./error.base";

export class InvalidOTPException extends BaseError{
    constructor(message: string){
        super('INVALID_OTP', "Invalid OTP", 400);
    }
}