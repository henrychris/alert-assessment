import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorResponseFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      success: false,
      message: exception.message || 'An unexpected error occurred.',
      errors: exception.response?.message
        ? Array.isArray(exception.response.message)
          ? exception.response.message.map((msg: any) => ({ message: msg }))
          : [{ message: exception.response.message }]
        : [{ message: 'An unexpected error occurred.' }],
    };

    // todo: add more steps for various status codes.
    if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
      errorResponse.message = 'One or more validation errors';
    }

    response.status(status).json(errorResponse);
  }
}
