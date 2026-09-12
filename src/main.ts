import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Static file serving for uploads
  app.useStaticAssets({
    rootPath: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  // CORS Configuration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8080);
  console.log(`🚀 Backend running on port ${process.env.PORT || 8080}`);
}
bootstrap();
