import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { SignupRequest } from './dto/signup-request-dto';
import * as bcrypt from 'bcrypt';
import { it, describe, beforeEach, vi, expect } from 'vitest';

vi.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    passwordHash: 'mere',
    createdAt: new Date(),
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createAsync: vi.fn(),
            findByEmailAsync: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signupAsync', () => {
    it('should create a new user and return access token', async () => {
      const signupRequest: SignupRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      vi.spyOn(usersService, 'findByEmailAsync').mockResolvedValueOnce(null);
      vi
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce('hashed_password' as never);
      vi.spyOn(usersService, 'createAsync').mockResolvedValueOnce({
        id: 1,
        ...signupRequest,
        passwordHash: 'hashed_password',
        roles: [{ name: 'USER' }],
      } as any);
      vi.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('mock_token');

      const result = await service.signupAsync(signupRequest);

      expect(usersService.findByEmailAsync).toHaveBeenCalledWith(
        signupRequest.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(signupRequest.password, 10);
      expect(usersService.createAsync).toHaveBeenCalledWith({
        firstName: signupRequest.firstName,
        lastName: signupRequest.lastName,
        email: signupRequest.email,
        passwordHash: 'hashed_password',
      });
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should throw UnauthorizedException if email is already in use', async () => {
      const signupRequest: SignupRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      vi
        .spyOn(usersService, 'findByEmailAsync')
        .mockResolvedValueOnce(mockUser);

      await expect(service.signupAsync(signupRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
