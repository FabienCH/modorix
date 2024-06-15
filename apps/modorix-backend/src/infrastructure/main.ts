import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['chrome-extension://ohmnoaaknihgcbkflfjonahofjhjnofb', 'http://localhost:5173', 'https://x.com'],
  });
  await app.listen(3000);
}
bootstrap();
