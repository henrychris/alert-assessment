import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
            findAllAsync: jest.fn(),
            remove: jest.fn(),
            assignRoleAsync: jest.fn(),
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
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
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
      jest.spyOn(service, 'findAllAsync').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockRemove = jest
        .spyOn(service, 'remove')
        .mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockRemove).toHaveBeenCalledWith(1);
    });

    describe('assignRole', () => {
      it('should assign a role to a user', async () => {
        const assignRoleRequest = { userId: 1, roleId: 1 };
        const mockAssignRole = jest
          .spyOn(service, 'assignRoleAsync')
          .mockResolvedValue(undefined);

        await controller.assignRole(assignRoleRequest);
        expect(mockAssignRole).toHaveBeenCalledWith(assignRoleRequest);
      });
    });
  });
});
