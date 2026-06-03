import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://103.232.122.149:3000',
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}

bootstrap();
