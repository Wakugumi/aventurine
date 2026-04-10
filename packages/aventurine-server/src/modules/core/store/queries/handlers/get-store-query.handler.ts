import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetStoreQuery } from "../get-store.query";
import { Store } from "../../store.entity";
import { StoreService } from "../../store.service";

@QueryHandler(GetStoreQuery)
export class GetStoreQueryHandler implements IQueryHandler<GetStoreQuery> {
  constructor(private readonly storeService: StoreService) { }

  async execute(query: GetStoreQuery): Promise<Store> {
    return await this.storeService.findOne(query.storeId);


  }

}
