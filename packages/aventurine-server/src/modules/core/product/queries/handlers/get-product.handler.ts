import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { GetProductQuery } from "../get-product.query";
import { Product } from "../../product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileStoreService } from "src/modules/file-store/services/file-store.service";
import { FetchProductFilesQuery } from "../fetch-product-files.query";
import { ProductFileRecord } from "../../types/product-file.interface";
import { FileRecord, FileStore } from "src/modules/file-store/file-store.entity";


@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {

  constructor(@InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly fileService: FileStoreService,
    private readonly queryBus: QueryBus) { }

  async execute(query: GetProductQuery): Promise<Product> {

    const record = await this.productRepo.findOneByOrFail({ id: query.productId, ownerId: query.userId })

    const files = await this.queryBus.execute<FetchProductFilesQuery, ProductFileRecord[]>(
      new FetchProductFilesQuery([record.id])
    )

    const images = files.map<FileRecord>(f => ({

      key: f.fileKey,
      url: this.fileService.getPublicUrl(f.fileKey),
      id: f.fileId,
    }
    ))

    return { ...record, images }




  }

}
