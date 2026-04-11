import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePriceCommand } from "../create-price.command";
import { Price } from "../../price.entity";
import { PriceService } from "../../price.service";

@CommandHandler(CreatePriceCommand)
export class CreatePriceHandler implements ICommandHandler<CreatePriceCommand> {
  constructor(private readonly priceService: PriceService) { }

  async execute(command: CreatePriceCommand): Promise<Price> {
    return await this.priceService.create({
      productId: command.productId,
      currencyCode: command.currencyCode,
      label: command.label,
      amount: command.amount,
      displayLabel: command.displayLabel ?? command.label,
      ownerId: command.ownerId

    })

  }
}
