import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseError } from '../errors/error.base';

export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof BaseError) {
      response.status(exception.statusCode).json({
        code: exception.code,
        message: exception.message,
      });
    } else {
      response.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      });
    }
  }
}
