import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Production config (PostgreSQL via Railway proxy)
const isProduction = process.env.NODE_ENV === 'production' &&
  !!process.env.DB_HOST;

export const databaseConfig: TypeOrmModuleOptions = isProduction ? {
  type: 'postgres', // Hardcode sebagai workaround TypeScript strict typing
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '27475'), // Railway proxy default port
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  entities: ['dist/**/*.entity{.js,.ts}'],
  synchronize: true, // TEMPORARY: Auto-create tables for first deployment!
} : {
  type: 'better-sqlite3',
  database: 'db.sqlite',
  entities: ['./src/**/*.entity{.ts,.js}'],
  synchronize: true,
};
