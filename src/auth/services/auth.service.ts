import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateAuthDto, LoginAuthDto } from '../dto/create-auth.dto';
import { UsersService } from '../../users/services/users.service';
import { EnvelopesService } from '@/envelopes/services/envelopes.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly envelopeService: EnvelopesService,
    private readonly jwtService: JwtService
  ) {}




  async register({ username, email, password, role }: CreateAuthDto) {
    const userByEmail = await this.userService.findByEmail(email);
    if (userByEmail) throw new BadRequestException(`Email ${email} is already in use`);

    const userByUsername = await this.userService.findByUsername(username);
    if (userByUsername) throw new BadRequestException(`Username ${username} is already in use`);

    const user = await this.userService.create({ username, email, password, role });

    await this.envelopeService.create({
      name: "Principal",
      description: "Sobre Principal",
      envelope_amount: 0,
      is_main: true,
      user_id: user
    })

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

    const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
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
