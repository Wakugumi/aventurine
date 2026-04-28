
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryBus } from '@nestjs/cqrs';
import { FetchProductsHandler } from '../fetch-products.handler';
import { Product } from '../../../product.entity';
import { FileStoreService } from '../../../../../file-store/services/file-store.service';
import { FetchProductsQuery } from '../../../queries/fetch-products.query';
import { ProductFileRecord } from '../../../types/product-file.interface';

describe('FetchProductsHandler', () => {
  let handler: FetchProductsHandler;
  let repo: jest.Mocked<Repository<Product>>;
  let queryBus: jest.Mocked<QueryBus>;
  let fileService: jest.Mocked<FileStoreService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchProductsHandler,
        { provide: getRepositoryToken(Product), useValue: { createQueryBuilder: jest.fn() } },
        { provide: QueryBus, useValue: { execute: jest.fn() } },
        { provide: FileStoreService, useValue: { getPublicUrl: jest.fn() } },
      ],
    }).compile();

    handler = module.get(FetchProductsHandler);
    repo = module.get(getRepositoryToken(Product));
    queryBus = module.get(QueryBus);
    fileService = module.get(FileStoreService);
  });

  it('should return products with files and next cursor', async () => {
    const products = [
      { id: '1', label: 'A', displayName: 'Apple', createdAt: new Date('2025-01-01') },
      { id: '2', label: 'B', displayName: 'Banana', createdAt: new Date('2025-01-02') },
    ];

    const qb: any = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([products, 2]),
    };

    repo.createQueryBuilder = jest.fn().mockReturnValue(qb);

    const files: ProductFileRecord[] = [
      { productId: '1', fileKey: 'key1', fileId: 'f1' },
      { productId: '2', fileKey: 'key2', fileId: 'f2' },
    ];
    queryBus.execute.mockResolvedValue(files);

    fileService.getPublicUrl.mockImplementation(key => `https://cdn/${key}`);

    const query = {
      ownerId: 'owner1',
      label: undefined,
      displayName: undefined,
      pagination: { limit: 2, page: 1, sortBy: 'createdAt', sortOrder: 'ASC', cursor: null },
    };

    const result = await handler.execute(query as any);

    expect(result.data).toHaveLength(2);
    expect(result.data[0].images![0].url).toBe('https://cdn/key1');
    expect(result.data[1].images![0].url).toBe('https://cdn/key2');
    expect(result.pagination.cursor).toEqual(products[products.length - 1].createdAt);
    expect(qb.take).toHaveBeenCalledWith(2);
    expect(qb.orderBy).toHaveBeenCalledWith('x.createdAt', 'ASC');
  });

  it('should apply cursor filter for next page', async () => {
    const products = [
      { id: '3', label: 'C', displayName: 'Cherry', createdAt: new Date('2025-01-03') },
    ];

    const qb: any = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([products, 3]),
    };

    repo.createQueryBuilder = jest.fn().mockReturnValue(qb);
    queryBus.execute.mockResolvedValue([]);
    fileService.getPublicUrl.mockImplementation(key => `https://cdn/${key}`);

    const query = {
      ownerId: 'owner1',
      label: undefined,
      displayName: undefined,
      pagination: { limit: 1, page: 1, sortBy: 'createdAt', sortOrder: 'ASC', cursor: new Date('2025-01-02').toISOString() },
    };

    const result = await handler.execute(query as any);

    // Cursor filter applied
    expect(qb.andWhere).toHaveBeenCalledWith(
      'x.createdAt > :cursor',
      { cursor: query.pagination.cursor },
    );
    expect(result.data[0].id).toBe('3');
  });
});
