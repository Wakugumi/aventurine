import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AventurineConfigService } from 'src/engine/core-modules/aventurine-config/aventurine-config.service';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmService implements OnModuleInit, OnModuleDestroy {
  private mainDataSource: DataSource;

  constructor(
    private readonly AventurineConfigService: AventurineConfigService,
  ) {
    // directive for testing conditions
    const isJest = process.argv.some((arg) => arg.includes('jest'));

    this.mainDataSource = new DataSource({
      url: AventurineConfigService.get('DATABASE_URL'),
      type: 'postgres',
      logging: AventurineConfigService.getLoggingConfig(),
      schema: 'core',
      entities: [
        `${isJest ? '' : 'dist/'}src/engine/core-modules/**/*.entity{.ts,.js}`,
      ],
      metadataTableName: '_typeorm_generated_columns_and_materialized_views',
      ssl: AventurineConfigService.get('DATABASE_SSL_ALLOW_SELF_SIGNED')
        ? { rejectUnauthorized: false }
        : undefined,
      extra: {
        query_timeout: 10000,
      },
    });
  }

  public getMainDataSource(): DataSource {
    return this.mainDataSource;
  }

  public async createSchema(schemaName: string): Promise<string> {
    const queryRunner = this.mainDataSource.createQueryRunner();

    await queryRunner.createSchema(schemaName, true);
    await queryRunner.release();

    return schemaName;
  }

  public async deleteSchema(schemaName: string): Promise<void> {
    const queryRunner = this.mainDataSource.createQueryRunner();

    await queryRunner.dropSchema(schemaName, true, true);
    await queryRunner.release();
  }

  async onModuleInit() {
    await this.mainDataSource.initialize();
  }

  async onModuleDestroy() {
    await this.mainDataSource.destroy();
  }
}
