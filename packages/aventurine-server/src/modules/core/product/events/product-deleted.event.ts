import { Product } from "../product.entity";

export class ProductDeletedEvent {
  constructor(
    public readonly productId: string,
    public readonly data: Partial<Product>
  ) { }
}
