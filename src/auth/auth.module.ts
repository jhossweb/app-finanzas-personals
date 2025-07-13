import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';


import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants/constant';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy';


@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtCookieStrategy],
})
export class AuthModule {}
