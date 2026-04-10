import { Query } from "@nestjs/cqrs";
import { Price } from "../price.entity";
import { CurrencyCode } from "../types/currency.enum";

export class FetchPricesQuery extends Query<Price[]> {
  constructor(
    public readonly productId: string,
    public readonly label?: string,
    public readonly displayName?: string,
    public readonly currencyCode?: CurrencyCode,

  ) {

    super();
  }
}
