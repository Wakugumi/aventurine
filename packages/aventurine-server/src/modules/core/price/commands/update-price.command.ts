import { Command } from "@nestjs/cqrs";
import { Price } from "../price.entity";
import { DeepPartial } from "typeorm";

export class UpdatePriceCommand extends Command<Price> {

  constructor(
    public readonly priceId: string,
    public readonly userId: string,
    public readonly payload: DeepPartial<Price>
  ) { super(); }

}
