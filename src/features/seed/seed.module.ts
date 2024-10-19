import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SeedService, PrismaService],
})
export class SeedModule {}
