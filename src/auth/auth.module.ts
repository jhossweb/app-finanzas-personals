import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { EnvelopesModule } from '@/envelopes/envelopes.module';


@Module({
  imports: [
    ConfigModule,
    UsersModule,
    EnvelopesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtCookieStrategy],
})
export class AuthModule {}
