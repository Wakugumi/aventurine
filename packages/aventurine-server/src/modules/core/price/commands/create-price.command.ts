import { Command } from "@nestjs/cqrs";
import { Price } from "../price.entity";
import { CurrencyCode } from "../types/currency.enum";

export class CreatePriceCommand extends Command<Price> {
  constructor(
    public readonly productId: string,
    public readonly ownerId: string,
    public readonly label: string,
    public readonly currencyCode: CurrencyCode,
    public readonly amount: number,
    public readonly displayLabel?: string,

  ) { super() }
}
