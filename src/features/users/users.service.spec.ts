import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { it, describe, beforeEach, vi, expect } from 'vitest';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    passwordHash: 'mere',
    createdAt: new Date(),
  };

  const mockRole: Role = {
    id: 1,
    name: 'Admin',
    permissions: ['READ'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllAsync', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [mockUser];
      vi.spyOn(prismaService.user, 'findMany').mockResolvedValueOnce(mockUsers);

      expect(await service.findAllAsync()).toBe(mockUsers);
    });
  });

  describe('remove', () => {
    it('should remove a user if found', async () => {
      vi.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(mockUser);
      vi.spyOn(prismaService.user, 'delete').mockResolvedValueOnce(mockUser);

      await service.remove(1);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      vi.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRoleAsync', () => {
    it('should assign a role to a user if both exist', async () => {
      vi.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(mockUser);
      vi.spyOn(prismaService.role, 'findFirst').mockResolvedValueOnce(mockRole);
      vi.spyOn(prismaService.user, 'update').mockResolvedValueOnce(mockUser);

      await service.assignRoleAsync({ userId: 1, roleId: 1 });

      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      vi.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      await expect(
        service.assignRoleAsync({ userId: 1, roleId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if role not found', async () => {
      vi.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(mockUser);
      vi.spyOn(prismaService.role, 'findFirst').mockResolvedValueOnce(null);

      await expect(
        service.assignRoleAsync({ userId: 1, roleId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
