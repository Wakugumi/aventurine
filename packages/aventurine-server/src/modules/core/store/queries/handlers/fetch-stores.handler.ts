import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchStoresQuery } from "../fetch-stores.query";
import { Store } from "../../store.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";

@QueryHandler(FetchStoresQuery)
export class FetchStoresHandler implements IQueryHandler<FetchStoresQuery> {
  constructor(@InjectRepository(Store) private readonly repo: Repository<Store>) { }

  async execute(query: FetchStoresQuery): Promise<Store[]> {

    const qb = this.repo.createQueryBuilder('x');

    qb.where('x.ownerId = :id', { id: query.userId }).select();

    if (query.query?.label || query.query?.displayName) {
      qb.andWhere(
        new Brackets(sq => {
          if (query.query?.label) {
            sq.orWhere('x.label ILIKE :label', {
              label: `%${query.query?.label}%`,
            });
          }
          if (query.query?.displayName) {
            sq.orWhere('x.displayName ILIKE :name', {
              name: `%${query.query?.displayName}%`,
            });
          }
        }),
      );
    }


    return qb.getMany();

  }

}
