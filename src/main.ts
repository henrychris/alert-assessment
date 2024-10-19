import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as logger from 'morgan';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints!).join(', '),
          })),
        );
      },
    }),
  );

  const configService = app.get(ConfigService);
  const PORT: number = configService.getOrThrow('PORT');

  app
    .listen(PORT)
    .then(() => {
      console.log(`App listening on http://localhost:${PORT}`);
    })
    .catch((error) => {
      console.error(error);
      app.close();
    });
}
bootstrap();
