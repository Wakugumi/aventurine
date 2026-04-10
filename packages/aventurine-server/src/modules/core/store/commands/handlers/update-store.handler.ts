import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateStoreCommand } from "../update-store.command";
import { Store } from "../../store.entity";
import { StoreService } from "../../store.service";


@CommandHandler(UpdateStoreCommand)
export class UpdateStoreHandler implements ICommandHandler<UpdateStoreCommand> {
  constructor(private readonly storeService: StoreService) { }

  async execute(command: UpdateStoreCommand): Promise<Store> {
    return await this.storeService.update(command.storeId, command.userId, command.payload)


  }

}
