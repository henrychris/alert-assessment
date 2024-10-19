import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupRequest } from './dto/signup-request-dto';
import { UsersService } from '../users/users.service';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signupAsync(signupRequest: SignupRequest) {
    const user = await this.userService.findByEmailAsync(signupRequest.email);
    if (user) {
      console.warn('This email is already in use.');
      throw new UnauthorizedException(
        'An account exists with this email address.',
      );
    }

    const hashedPassword = await hash(signupRequest.password, 10);
    const newUser = await this.userService.createAsync({
      firstName: signupRequest.firstName,
      lastName: signupRequest.lastName,
      email: signupRequest.email,
      passwordHash: hashedPassword,
    });

    const payload = new JwtPayload(newUser.id);
    return {
      access_token: await this.jwtService.signAsync(
        JSON.parse(JSON.stringify(payload)),
      ),
    };
  }
}
