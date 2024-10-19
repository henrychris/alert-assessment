import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupRequest } from './dto/signup-request-dto';
import { UsersService } from '../users/users.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwtPayload';
import { LoginRequest } from './dto/login-request-dto';

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

    const payload = new JwtPayload(
      newUser.id,
      newUser.roles.map((x) => x.name),
    );
    return {
      access_token: await this.jwtService.signAsync(
        JSON.parse(JSON.stringify(payload)),
      ),
    };
  }

  async loginAsync(loginRequest: LoginRequest) {
    const user = await this.userService.findByEmailAsync(loginRequest.email);
    if (!user) {
      console.warn('User not found. Email or password is incorrect.');
      throw new UnauthorizedException('email or password incorrect.');
    }

    const isPasswordValid = await compare(
      loginRequest.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      console.warn(`User found. User id: ${user.id}. Password incorrect.`);
      throw new UnauthorizedException('email or password incorrect.');
    }

    const payload = new JwtPayload(
      user.id,
      user.roles.map((x) => x.name),
    );
    return {
      access_token: await this.jwtService.signAsync(
        JSON.parse(JSON.stringify(payload)),
      ),
    };
  }
}
