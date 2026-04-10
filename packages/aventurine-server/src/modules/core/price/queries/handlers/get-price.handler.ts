import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPriceQuery } from "../get-price.query";
import { Price } from "../../price.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@QueryHandler(GetPriceQuery)
export class GetPriceHandler implements IQueryHandler<GetPriceQuery> {
  constructor(@InjectRepository(Price) private readonly repo: Repository<Price>) { }

  async execute(query: GetPriceQuery): Promise<Price> {

    return await this.repo.findOneByOrFail({ id: query.priceId })

  }

}
