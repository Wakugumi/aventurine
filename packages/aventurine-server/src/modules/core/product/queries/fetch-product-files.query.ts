import { Query } from "@nestjs/cqrs";
import { ProductFileRecord } from "../types/product-file.interface";

export class FetchProductFilesQuery extends Query<ProductFileRecord[]> {
  constructor(public readonly productIds: string[]) { super() }
}
