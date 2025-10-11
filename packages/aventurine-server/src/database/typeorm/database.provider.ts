import { DataSource } from "typeorm";
import { DATA_SOURCE } from "../database.constants";

// to check Jest

const isJest = process.argv.some((arg) => arg.includes('jest'));

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({

        url: process.env.DATABASE_URL,
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        type: 'postgres',
        schema: 'core',
        entities: [
          isJest ? 'src/**/*.entity{.ts,.js}' : 'dist/**/*.entity{.ts,.js}',
        ],
        migrationsRun: false,
        synchronize: false,
        migrationsTableName: '_typeorm_migrations',
        migrations: [
          isJest ? 'src/database/migrations/*{.ts,.js}' : 'dist/database/migrations/*{.ts,.js}'
        ],
        ssl: process.env.DATABASE_SSL_ALLOW_SELF_SIGNED === 'true' ? { rejectUnauthorized: false } : false,


      });
      return dataSource.initialize();
    }
  }
]
