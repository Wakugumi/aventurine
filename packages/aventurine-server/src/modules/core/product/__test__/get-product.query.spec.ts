import { Product } from "../product.entity";
import { FetchProductFilesQuery } from "../queries/fetch-product-files.query";
import { GetProductQuery } from "../queries/get-product.query";
import { GetProductHandler } from "../queries/handlers/get-product.handler";


describe('GetProductHandler', () => {
  let handler: GetProductHandler;
  let productRepo: any;
  let fileService: any;
  let queryBus: any;

  beforeEach(() => {
    productRepo = {
      findOneByOrFail: jest.fn(),
    };

    fileService = {
      getPublicUrl: jest.fn(),
    };

    queryBus = {
      execute: jest.fn(),
    };

    handler = new GetProductHandler(productRepo as any, fileService as any, queryBus as any);
  });

  it('returns product with images', async () => {
    const productId = 'p1';
    const userId = 'u1';

    const product: Product = {
      id: productId,
      ownerId: userId,
      name: 'Test',
    } as any;

    const fileRecords = [
      { productId, fileKey: 'a.jpg' },
      { productId, fileKey: 'b.jpg' },
    ];

    productRepo.findOneByOrFail.mockResolvedValue(product);

    queryBus.execute.mockResolvedValue(fileRecords);

    fileService.getPublicUrl
      .mockImplementation((key: string) => `https://cdn/${key}`);

    const result = await handler.execute(new GetProductQuery(productId, userId));

    expect(productRepo.findOneByOrFail).toHaveBeenCalledWith({
      id: productId,
      ownerId: userId,
    });

    expect(queryBus.execute).toHaveBeenCalledWith(
      new FetchProductFilesQuery([productId]),
    );


    expect(result.images).toEqual([
      {
        id: undefined,
        key: "a.jpg",
        url: 'https://cdn/a.jpg'
      },
      {
        id: undefined,
        key: "b.jpg",
        url: 'https://cdn/b.jpg'
      }
    ]);

    expect(result.id).toBe(productId);
  });
});
