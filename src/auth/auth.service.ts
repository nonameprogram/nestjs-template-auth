import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up-dto';
import { SignInDto } from './dto/sign-in-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.create(signUpDto);
    const { password, ...payload } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto.username);
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const { password, ...payload } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
