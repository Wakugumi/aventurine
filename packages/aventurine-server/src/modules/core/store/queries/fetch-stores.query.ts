import { Query } from "@nestjs/cqrs";
import { Store } from "../store.entity";
import { DeepPartial } from "typeorm";

export class FetchStoresQuery extends Query<Store[]> {

  constructor(
    public readonly userId: string,
    public readonly query?: DeepPartial<Store>

  ) { super(); }

}
