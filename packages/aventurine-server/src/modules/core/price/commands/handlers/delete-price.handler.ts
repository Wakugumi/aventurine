import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeletePriceCommand } from "../delete-price.command";
import { PriceService } from "../../price.service";
import { Price } from "../../price.entity";

@CommandHandler(DeletePriceCommand)
export class DeletePriceHandler implements ICommandHandler<DeletePriceCommand> {

  constructor(private readonly priceService: PriceService) {

  }


  async execute(command: DeletePriceCommand): Promise<Price> {
    await this.priceService.ensureOwnership(command.priceId, command.userId)
    return await this.priceService.delete(command.priceId)
  }

}
