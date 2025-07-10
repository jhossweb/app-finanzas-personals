import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateAuthDto, LoginAuthDto } from '../dto/create-auth.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register({ username, email, password }: CreateAuthDto) {
    const userByEmail = await this.userService.findByEmail(email);
    if (userByEmail) throw new BadRequestException(`Email ${email} is already in use`);

    const userByUsername = await this.userService.findByUsername(username);
    if (userByUsername) throw new BadRequestException(`Username ${username} is already in use`);

    return this.userService.create({ username, email, password });

  }

  async login (dataLogin: LoginAuthDto) {
    const { email, username, password } = dataLogin;

    if (!email && !username) {
      throw new BadRequestException('Email or username is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const user = email
      ? await this.userService.findByEmail(email)
      : await this.userService.findByUsername(username as string);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    }
  }

}
