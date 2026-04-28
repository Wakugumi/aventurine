import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckLabelSafeQuery } from "../check-label-safe.query";
import { ProductService } from "../../product.service";

@QueryHandler(CheckLabelSafeQuery)
export class CheckLabelSafeHandler implements IQueryHandler<CheckLabelSafeQuery> {


  constructor(private readonly productService: ProductService) { }


  async execute(query: CheckLabelSafeQuery): Promise<boolean> {
    return await this.productService.checkLabelSafe(query.ownerId, query.label)
  }

}
