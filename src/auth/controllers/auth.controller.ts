import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';


import { AuthService } from '../services/auth.service';
import { CreateAuthDto, LoginAuthDto } from '../dto/create-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }


  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, user } = await this.authService.login(loginAuthDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax', // Prevent CSRF attacks
      domain: 'localhost', // Adjust domain as needed
    });
    return { user };
  }

}
