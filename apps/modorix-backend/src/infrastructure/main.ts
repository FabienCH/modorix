import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { getEnvValue } from 'src/get-env-value';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['chrome-extension://ohmnoaaknihgcbkflfjonahofjhjnofb', getEnvValue('WEB_APP_URL'), 'https://x.com'],
  });
  await app.listen(3000);
}
bootstrap();
