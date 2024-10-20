import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { PrismaService } from '../../prisma/prisma.service';
import { it, describe, beforeEach, vi, expect } from 'vitest';

describe('SeedService', () => {
  let service: SeedService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: vi.fn(),
              findUnique: vi.fn(),
              findFirst: vi.fn(),
              create: vi.fn(),
              delete: vi.fn(),
              update: vi.fn(),
            },
            role: {
              findFirst: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
