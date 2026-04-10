import { Query } from "@nestjs/cqrs";
import { Price } from "../price.entity";

export class GetPriceQuery extends Query<Price> {
  constructor(
    public readonly priceId: string

  ) { super(); }
}
