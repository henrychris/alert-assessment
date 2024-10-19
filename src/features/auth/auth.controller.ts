import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequest } from './dto/signup-request-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() signupRequest: SignupRequest) {
    return await this.authService.signupAsync(signupRequest);
  }
}
