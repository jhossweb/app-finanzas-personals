import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get<string>('API_PREFIX') || 'api');

  await app.listen(configService.get<number>('APP_PORT') || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  
}
bootstrap();
