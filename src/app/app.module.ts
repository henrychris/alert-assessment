import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../features/users/users.module';
import { AuthModule } from '../features/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SeedModule } from '../features/seed/seed.module';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/features/auth/guards/role.guard';
import { AuthGuard } from 'src/features/auth/guards/auth.guard';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationOptions: {
        noDefaults: true,
        abortEarly: false,
      },
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // note the order of the guards below matters.
    // the auth guard, registered first, will run before the roles guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
