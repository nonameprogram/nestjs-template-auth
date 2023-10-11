import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up-dto';
import { SignInDto } from './dto/sign-in-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.usersService.create(signUpDto);
    const { password, ...payload } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto.username);
    const isMatch = await bcrypt.compare(signInDto.password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const { password, ...payload } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
