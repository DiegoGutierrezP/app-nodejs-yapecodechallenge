import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../../application/dtos';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, customResponse } = this.handleException(exception);

    response.status(status).json(customResponse);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private handleException(exception: unknown) {
    const status = this.getHttpStatus(exception);

    const response: BaseResponse<unknown> = {
      code: status,
      data: null,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      const excepResponse = exception.getResponse();

      if (typeof excepResponse === 'object') {
        const res = excepResponse as Record<string, any>;
        response.message = Array.isArray(res.message)
          ? res.message[0] || exception.message
          : res.message || exception.message;
      } else {
        response.message = excepResponse.toString();
      }
    } else if (exception instanceof Error) {
      response.message = exception.message;
    } else if (typeof exception === 'string') {
      response.message = exception;
    }

    return {
      status,
      customResponse: response,
    };
  }
}
