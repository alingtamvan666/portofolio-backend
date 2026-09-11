import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration - seperti config/cors.php di Laravel
  // Allow frontend dari port 3001, localhost dari browser/mobile apps, dll
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // URL Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8080);
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 8080}`);
  console.log(`📋 API test: curl http://localhost:${process.env.PORT || 8080}/projects`);
}
bootstrap();
