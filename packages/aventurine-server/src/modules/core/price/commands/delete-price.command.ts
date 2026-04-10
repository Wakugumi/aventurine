import { Command } from "@nestjs/cqrs";
import { Price } from "../price.entity";

export class DeletePriceCommand extends Command<Price> {
  constructor(
    public readonly priceId: string,
    public readonly userId: string
  ) { super() }
}
