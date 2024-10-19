import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule, ConfigModule],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
