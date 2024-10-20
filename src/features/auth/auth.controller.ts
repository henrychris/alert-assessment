import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/signup-request-dto';
import { LoginRequest } from './dto/login-request-dto';
import { Public } from '../../decorators/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() signupRequest: SignupRequest) {
    return await this.authService.signupAsync(signupRequest);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginRequest: LoginRequest) {
    return await this.authService.loginAsync(loginRequest);
  }
}
