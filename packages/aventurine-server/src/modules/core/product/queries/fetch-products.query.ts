import { Query } from "@nestjs/cqrs";
import { Product } from "../product.entity";
import { PaginateOptions } from "src/utils/paginate.util";
import { PaginateResult } from "@aventurine/shared";

export class FetchProductsQuery extends Query<PaginateResult<Product>> {
  constructor(
    public readonly ownerId: string,
    public readonly pagination: PaginateOptions,
    public readonly label?: string,
    public readonly displayName?: string,
    public readonly draft?: boolean

  ) { super() }
}
