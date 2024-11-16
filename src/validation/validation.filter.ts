import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ValidationFilter<T> implements ExceptionFilter<ZodError> {
  catch(exception: ZodError, host: ArgumentsHost) {

    const http = host.switchToHttp()
    const response = http.getResponse<Response>()

    response.status(422).json({
      code: 422,
      errors: exception.errors
    })

  }
}
