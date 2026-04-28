import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { DeepPartial, QueryFailedError, Repository } from 'typeorm';
import { ProductException, ProductExceptionCode } from './product.exception';
import { FileStoreService } from 'src/modules/file-store/services/file-store.service';
import { FileContext } from 'src/modules/file-store/enums/file-context.enum';
import { ProductStatus } from './types/product-status.enum';
import { randomUUID } from 'crypto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductEvents } from './types/product-event.type';
import { ProductDeletedEvent } from './events/product-deleted.event';
import { SignedUrlResult } from 'src/engine/storage/types/storage.types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly fileService: FileStoreService,
    private readonly eventEmitter: EventEmitter2
  ) { }


  async findOneById(productId: string): Promise<Product | null> {

    return await this.productRepo.findOneBy({ id: productId });

  }


  /**
   * Draft mode product
   */
  async createProduct(payload: DeepPartial<Product>) {
    try {
      return await this.productRepo.save({

        label: payload.label ?? randomUUID(),
        displayName: payload.displayName ?? "Product",
        ownerId: payload.ownerId,
        status: ProductStatus.DRAFT
      })
    } catch (error) {

      if (error instanceof QueryFailedError) {
        if (error.message.includes('unique') || error.message.includes('duplicate')) {
          throw new Error(`Product with label "${payload.label}" already exists for this user`);
        }
      }
      throw error;
    }
  }

  async updateProduct(productId: string, userId: string, payload: DeepPartial<Product>) {
    if (!(await this.productRepo.existsBy({ id: productId, ownerId: userId })))
      throw new ProductException("No product associated with this id and this user", ProductExceptionCode.PRODUCT_NOT_EXIST)

    console.log(productId, userId, payload)

    try {

      return await this.productRepo.update({ id: productId, ownerId: userId }, payload)
    } catch (error) {


      throw error;
    }

  }

  /**
  * Mark product as active
  */
  async submitProduct(productId: string, userId: string) {
    if (!await this.productRepo.existsBy({ id: productId, ownerId: userId }))
      throw new ProductException("No product associated with this id and this user", ProductExceptionCode.PRODUCT_NOT_EXIST)

    try {
      return await this.productRepo.update({
        id: productId, ownerId: userId
      }, { status: ProductStatus.ACTIVE })
    } catch (error) {

      throw error;
    }
  }


  /**
  * TODO: implement safe checking logic for any record dependency of Product
  * For now: Record use cascade delete
  */
  async deleteProduct(productId: string, userId: string) {
    const record = await this.productRepo.findOneBy({ id: productId, ownerId: userId })
    if (!record)
      throw new ProductException("No product associated with this id and this user", ProductExceptionCode.PRODUCT_NOT_EXIST)


    await this.productRepo.update({ id: productId }, { status: ProductStatus.DELETED })
    await this.productRepo.softDelete({ id: productId });

    this.eventEmitter.emit(ProductEvents.DELETED, new ProductDeletedEvent(record.id, record))

  }

  async uploadImage(productId: string, userId: string, fileName: string): Promise<{
    credentials: SignedUrlResult,
    fileId: string,
    fileKey: string
  }> {
    const productRecord = await this.productRepo.findOneBy({ id: productId, ownerId: userId })

    if (!productRecord)
      throw new ProductException("No product associated with this id and this user", ProductExceptionCode.PRODUCT_NOT_EXIST)

    return await this.fileService.createUpload(productId, { fileName: fileName, context: FileContext.PRODUCT })

  }


  async removeImage(productId: string, userId: string, fileId: string) {
    const productRecord = await this.productRepo.findOneBy({ id: productId, ownerId: userId });

    if (!productRecord)
      throw new ProductException("No product associated with this id and this user", ProductExceptionCode.PRODUCT_NOT_EXIST)


    await this.fileService.immediateDeleteFile({ fileId: fileId, referenceId: productRecord.id })

  }

  async checkLabelSafe(ownerId: string, label: string) {
    const exists = await this.productRepo.existsBy({ label: label, ownerId: ownerId });

    return !exists
  }

}
