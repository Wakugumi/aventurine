import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { GetProductHandler } from './queries/handlers/get-product.handler';
import { FetchProductsHandler } from './queries/handlers/fetch-products.handler';
import { ProductFilesService } from './product-files.service';
import { ProductFilesViewBootstrap } from './module_inits/materialized_view_product.bootstrap';
import { FetchProductFilesHandler } from './queries/handlers/fetch-product-files.handler';
import { FileStoreModule } from 'src/modules/file-store/file-store.module';
import { RemoveProductImageHandler } from './commands/handlers/remove-product-image.handler';
import { PriceModule } from '../price/price.module';
import { DraftProductHandler } from './commands/handlers/draft-product.handler';
import { SubmitProductHandler } from './commands/handlers/submit-product.handler';
import { ProductController } from './product.controller';
import { UpdateProductHandler } from './commands/handlers/update-product.handler';
import { UploadProductImageHandler } from './commands/handlers/upload-product-image.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), FileStoreModule, PriceModule],
  providers: [ProductService, GetProductHandler, FetchProductsHandler, ProductFilesService, ProductFilesViewBootstrap, FetchProductFilesHandler, RemoveProductImageHandler, DraftProductHandler, SubmitProductHandler, UpdateProductHandler, UploadProductImageHandler],
  controllers: [ProductController],
  exports: [TypeOrmModule, ProductService]
})
export class ProductModule { }
