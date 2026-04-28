import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchProductFilesQuery } from "../fetch-product-files.query";
import { ProductFileRecord } from "../../types/product-file.interface";
import { FileContext } from "src/modules/file-store/enums/file-context.enum";
import { FileStoreStatus } from "@aventurine/shared";
import { FileStoreService } from "src/modules/file-store/services/file-store.service";

@QueryHandler(FetchProductFilesQuery)
export class FetchProductFilesHandler implements IQueryHandler<FetchProductFilesQuery> {

  constructor(private readonly fileService: FileStoreService) { }
  async execute(query: FetchProductFilesQuery): Promise<ProductFileRecord[]> {
    if (query.productIds.length === 0) return [];

    const files = await this.fileService.getBulkFiles({
      referenceIds: query.productIds,
      status: FileStoreStatus.ACTIVE,
      context: FileContext.PRODUCT

    });
    return files.map<ProductFileRecord>((x) => {
      return {
        context: x.context,
        status: x.status,
        fileId: x.id,
        fileKey: x.key,
        productId: x.referenceId,
        createdAt: x.createdAt
      }
    });
  }

}
