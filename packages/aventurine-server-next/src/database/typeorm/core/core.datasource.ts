import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  override: true,
});

const isJest = process.argv.some((arg) => arg.includes('jest'));

export const typeORMCoreModuleOptions: TypeOrmModuleOptions = {
  url: process.env.DATABASE_URL,
  type: 'postgres',
  logging: ['error'], // Error-level only logging
  schema: 'core',
  entities: [
    `${isJest ? '' : 'dist/'}src/engine/core-modules/**/*.entity{.ts,.js}`, // Just in case someone wrote in Javascript
  ],
  synchronize: false, // Standard setup, use migration on production (must practice)
  migrationsRun: false,
  migrationsTableName: '_typeorm_migrations',
  metadataTableName: '_typeorm_generated_columns_and_materialized_views',
  migrations: [
    `${isJest ? '' : 'dist/'}src/database/typeorm/core/migrations/common/*{.ts,.js}`,
  ],
  ssl:
    process.env.DATABASE_SSL_ALLOW_SELF_SIGNED === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
};
export const connectionSource = new DataSource(
  typeORMCoreModuleOptions as DataSourceOptions,
);
