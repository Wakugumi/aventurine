import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePriceCommand } from "../update-price.command";
import { PriceService } from "../../price.service";
import { Price } from "../../price.entity";

@CommandHandler(UpdatePriceCommand)
export class UpdatePriceHandler implements ICommandHandler<UpdatePriceCommand> {


  constructor(private readonly priceService: PriceService) { }


  async execute(command: UpdatePriceCommand): Promise<Price> {

    await this.priceService.update(command.priceId, command.userId, command.payload)
    return await this.priceService.findOneById(command.priceId)

  }

}
