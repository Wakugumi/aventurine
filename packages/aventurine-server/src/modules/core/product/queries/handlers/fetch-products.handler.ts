import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { FetchProductsQuery } from "../fetch-products.query";
import { Product } from "../../product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { PaginateResult } from "@aventurine/shared";
import { FetchProductFilesQuery } from "../fetch-product-files.query";
import { ProductFileRecord } from "../../types/product-file.interface";
import { FileStoreService } from "src/modules/file-store/services/file-store.service";
import { FileRecord } from "src/modules/file-store/file-store.entity";
import { ProductStatus } from "../../types/product-status.enum";

@QueryHandler(FetchProductsQuery)
export class FetchProductsHandler implements IQueryHandler<FetchProductsQuery> {

  constructor(@InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly queryBus: QueryBus,
    private readonly fileService: FileStoreService) { }


  async execute(query: FetchProductsQuery): Promise<PaginateResult<Product>> {
    const qb = this.productRepo.createQueryBuilder('x');

    qb.andWhere('x.ownerId = :id', { id: query.ownerId });

    if (query.draft)
      qb.orWhere('x.status = :status', { status: ProductStatus.DRAFT })
    else

      qb.andWhere('x.status = :status', { status: ProductStatus.ACTIVE })




    if (query.label || query.displayName) {
      qb.andWhere(
        new Brackets(sq => {
          if (query.label) {
            sq.orWhere('x.label ILIKE :label', {
              label: `%${query.label}%`,
            });
          }
          if (query.displayName) {
            sq.orWhere('x.displayName ILIKE :name', {
              name: `%${query.displayName}%`,
            });
          }
        }),
      );
    }

    const { page, limit, sortBy, sortOrder, cursor } = query.pagination;
    // Sorting
    const orderField = `x.${sortBy || 'createdAt'}`;
    const orderDirection = sortOrder || 'ASC';

    qb.orderBy(orderField, orderDirection as 'ASC' | 'DESC');
    if (cursor)

      qb.andWhere(`${orderField} ${orderDirection === 'ASC' ? '>' : '<'} :cursor`, { cursor });

    else
      qb.skip((page - 1) * limit)



    qb.take(limit)


    const [data, total] = await qb.getManyAndCount()



    const productIds = data.map(p => p.id);
    const files = await this.queryBus.execute<FetchProductFilesQuery, ProductFileRecord[]>(
      new FetchProductFilesQuery(productIds)
    )


    // Map files to products
    const fileMap = files.reduce((map, f) => {
      if (!map.has(f.productId)) map.set(f.productId, []);
      map.get(f.productId)!.push({
        key: f.fileKey,
        id: f.fileId,
        url: this.fileService.getPublicUrl(f.fileKey),
      });
      return map;
    }, new Map<string, FileRecord[]>());

    const compiledData = data.map(p => ({
      ...p,
      images: fileMap.get(p.id) ?? [],
    }));

    const nextCursor = compiledData.length
      ? compiledData[compiledData.length - 1][sortBy] // last item's sort value
      : null;

    return {
      pagination: {
        limit: query.pagination.limit,
        page: query.pagination.page,
        total: total,
        cursor: nextCursor
      },
      data: compiledData
    } as PaginateResult<Product>



  }

}
