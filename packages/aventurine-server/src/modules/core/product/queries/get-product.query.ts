import { Query } from "@nestjs/cqrs";
import { Product } from "../product.entity";

export class GetProductQuery extends Query<Product> {
  constructor(
    public readonly productId: string,
    public readonly userId: string
  ) {
    super();
  }
}
