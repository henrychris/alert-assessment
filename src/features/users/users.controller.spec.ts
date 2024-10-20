import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { it, describe, beforeEach, vi, expect } from 'vitest';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAllAsync: vi.fn(),
            remove: vi.fn(),
            assignRoleAsync: vi.fn(),
          },
        },
        {
          provide: AuthGuard,
          useClass: AuthGuard,
        },
        {
          provide: RolesGuard,
          useClass: RolesGuard,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: vi.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@email.com',
          roles: [],
        },
      ];
      vi.spyOn(service, 'findAllAsync').mockResolvedValueOnce(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockRemove = vi
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(undefined);

      await controller.remove(1);

      expect(mockRemove).toHaveBeenCalledWith(1);
    });

    describe('assignRole', () => {
      it('should assign a role to a user', async () => {
        const assignRoleRequest = { userId: 1, roleId: 1 };
        const mockAssignRole = vi
          .spyOn(service, 'assignRoleAsync')
          .mockResolvedValueOnce(undefined);

        await controller.assignRole(assignRoleRequest);
        expect(mockAssignRole).toHaveBeenCalledWith(assignRoleRequest);
      });
    });
  });
});
