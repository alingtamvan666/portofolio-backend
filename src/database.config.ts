import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Production config (PostgreSQL)
const isProduction = process.env.NODE_ENV === 'production' &&
  !!process.env.DB_HOST &&
  !!process.env.DB_USER &&
  !!process.env.DB_PASSWORD &&
  !!process.env.DB_NAME;

export const databaseConfig: TypeOrmModuleOptions = isProduction ? {
  type: 'postgres', // Hardcode sebagai workaround TypeScript strict typing
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.js,.ts}', './src/**/*.entity{.ts,.js}'],
  synchronize: false,
} : {
  type: 'better-sqlite3',
  database: 'db.sqlite',
  entities: ['dist/**/*.entity{.js,.ts}', './src/**/*.entity{.ts,.js}'],
  synchronize: true,
};
