import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  override: true,
});

const typeORMRawModuleOptions: DataSourceOptions = {
  url: process.env.DATABASE_URL,
  type: 'postgres',
  logging: ['error'],
  ssl:
    process.env.DATABASE_SSL_ALLOW_SELF_SIGNED === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
};

export const rawDataSource = new DataSource(typeORMRawModuleOptions);
