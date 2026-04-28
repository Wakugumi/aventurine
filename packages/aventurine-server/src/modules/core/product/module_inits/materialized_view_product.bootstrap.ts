
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductFilesViewBootstrap implements OnModuleInit {
  private readonly logger = new Logger(ProductFilesViewBootstrap.name);

  constructor(private readonly dataSource: DataSource) { }

  public async onModuleInit(): Promise<void> {
    // Only run for Postgres datasource
    const isPostgres = this.dataSource.options.type === 'postgres';
    if (!isPostgres) {
      this.logger.warn('DataSource is not Postgres; skipping materialized view bootstrap.');
      return;
    }

    try {
      const viewExists = await this.checkViewExists();
      if (viewExists) {
        this.logger.debug('product_files_view already exists; skipping creation.');
        return;
      }

      this.logger.log('product_files_view not found; creating materialized view and indexes...');
      await this.createMaterializedViewAndIndexes();
      this.logger.log('product_files_view created successfully.');
    } catch (err) {
      this.logger.error('Failed to ensure product_files_view exists', err as any);
      // Decide: Surface the error or swallow. In dev you may throw; in prod you might log and continue.
      // Here we choose to log and continue so app can still boot even if DB perms are restricted.
    }
  }

  private async checkViewExists(): Promise<boolean> {
    const sql = `
      SELECT 1
      FROM pg_matviews
      WHERE matviewname = 'product_files_view'
      LIMIT 1;
    `;
    const res = await this.dataSource.query(sql);
    return res.length > 0;
  }

  private async checkIndexExists(indexName: string): Promise<boolean> {
    const sql = `
      SELECT 1
      FROM pg_indexes
      WHERE indexname = $1
      LIMIT 1;
    `;
    const res = await this.dataSource.query(sql, [indexName]);
    return res.length > 0;
  }

  private async createMaterializedViewAndIndexes(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.query(`
        
CREATE MATERIALIZED VIEW product_files_view AS
SELECT
  f."referenceId" AS "productId",
  f.id            AS "fileId",
  f.key           AS "fileKey",
  f.context       AS context,
  f.status        AS status,
  f."createdAt"   AS "createdAt"
FROM file_store f
WHERE f.context = 'product'
  AND f.status = 'active';
      `);

      // create index on product_id
      const idxName = 'product_files_view_product_id_idx';
      if (!(await this.checkIndexExists(idxName))) {
        await queryRunner.query(`
          CREATE UNIQUE INDEX ${idxName}
          ON product_files_view ("productId", "fileId");
        `);
      }

      // create unique index on file_id (required for REFRESH CONCURRENTLY)
      const uidName = 'product_files_view_file_id_uidx';
      if (!(await this.checkIndexExists(uidName))) {
        await queryRunner.query(`
          CREATE UNIQUE INDEX ${uidName}
          ON product_files_view ("fileId");
        `);
      }
    } finally {
      await queryRunner.release();
    }
  }
}
