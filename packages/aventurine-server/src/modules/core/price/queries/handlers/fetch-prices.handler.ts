import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchPricesQuery } from "../fetch-prices.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Price } from "../../price.entity";
import { Brackets, Repository } from "typeorm";

@QueryHandler(FetchPricesQuery)
export class FetchPricesHandler implements IQueryHandler<FetchPricesQuery> {
  constructor(@InjectRepository(Price) private readonly repo: Repository<Price>) {

  }


  async execute(query: FetchPricesQuery): Promise<Price[]> {

    const qb = this.repo.createQueryBuilder("x");

    qb.andWhere('x.productId = :id', { id: query.productId });

    const { displayName, currencyCode, label } = query;

    if (label || displayName) {
      qb.andWhere(
        new Brackets(sq => {
          if (label)
            sq.orWhere('x.label ILIKE :label', { label: `%${label}%` })
          if (displayName)
            sq.orWhere('x.displayLabel ILIKE :name', { name: `%${displayName}%` })

        })
      )
    }

    if (currencyCode)
      qb.andWhere('x.currencyCode = :curreny', { currency: currencyCode })


    return qb.getMany()
  }
}
