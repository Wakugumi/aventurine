
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductFileRecord } from './types/product-file.interface';


@Injectable()
export class ProductFilesService {
  constructor(private readonly db: DataSource) { }

  async findByProductId(productId: string): Promise<ProductFileRecord[]> {
    return this.db.query<ProductFileRecord[]>(
      `
      SELECT *
      FROM product_files_view
      WHERE product_id = $1
      ORDER BY created_at ASC
      `,
      [productId],
    );
  }
}
