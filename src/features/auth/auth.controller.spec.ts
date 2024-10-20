import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/signup-request-dto';
import { LoginRequest } from './dto/login-request-dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signupAsync: jest.fn(),
            loginAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.signupAsync with SignupRequest', async () => {
      const signupRequest: SignupRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedResult = { access_token: 'mock_token' };
      jest.spyOn(authService, 'signupAsync').mockResolvedValueOnce(expectedResult);

      const result = await controller.register(signupRequest);

      expect(authService.signupAsync).toHaveBeenCalledWith(signupRequest);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.loginAsync with LoginRequest', async () => {
      const loginRequest: LoginRequest = {
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult = { access_token: 'mock_token' };

      jest.spyOn(authService, 'loginAsync').mockResolvedValueOnce(expectedResult);

      const result = await controller.login(loginRequest);

      expect(authService.loginAsync).toHaveBeenCalledWith(loginRequest);
      expect(result).toEqual(expectedResult);
    });
  });
});
