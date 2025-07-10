import { ConfigModule, ConfigService } from "@nestjs/config";


ConfigModule.forRoot({
  envFilePath: `${process.env.NODE_ENV === 'develop' ? '.develop.env' : '.env'}`,
});

const configService = new ConfigService

export const jwtConstants = {
  secret: configService.get('JWT_SECRET'),
  expiresIn: configService.get('JWT_EXPIRES_IN') ,
};