import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

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
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            role: {
              findFirst: jest.fn(),
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
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

      expect(await service.findAllAsync()).toBe(mockUsers);
    });
  });

  describe('remove', () => {
    it('should remove a user if found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(mockUser);

      await service.remove(1);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRoleAsync', () => {
    it('should assign a role to a user if both exist', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.role, 'findFirst').mockResolvedValue(mockRole);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);

      await service.assignRoleAsync({ userId: 1, roleId: 1 });

      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        service.assignRoleAsync({ userId: 1, roleId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.role, 'findFirst').mockResolvedValue(null);

      await expect(
        service.assignRoleAsync({ userId: 1, roleId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
