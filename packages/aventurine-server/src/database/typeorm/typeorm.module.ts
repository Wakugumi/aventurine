
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AventurineConfigModule } from 'src/engine/aventurine-config/aventurine-config.module';
import { AventurineConfigService } from 'src/engine/aventurine-config/aventurine-config.service';


@Module({
  imports: [


    TypeOrmModule.forRootAsync({
      imports: [AventurineConfigModule],
      useFactory: async (config: AventurineConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        database: config.get('DATABASE_NAME') || 'aventurine',
        username: config.get('DATABASE_USER') || 'aventurine',
        password: config.get('DATABASE_PASSWORD'),
        entities: [
          process.env.NODE_ENV === 'test' ? 'src/**/*.entity{.ts,.js}' : 'dist/**/*.entity{.ts,.js}',
        ],
        migrationsRun: false,
        synchronize: true,
        migrationsTableName: '_typeorm_migrations',
        migrations: [
          process.env.NODE_ENV === 'test' ? 'src/database/migrations/*{.ts,.js}' : 'dist/database/migrations/*{.ts,.js}'
        ],
        ssl: config.get('DATABASE_SSL_ALLOW_SELF_SIGNED') ? { rejectUnauthorized: false } : false,

      }),
      inject: [AventurineConfigService],
    })

  ],

})
export class TypeORMModule { }
