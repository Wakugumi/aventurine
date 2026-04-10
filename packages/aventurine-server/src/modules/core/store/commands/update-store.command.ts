import { Command } from "@nestjs/cqrs";
import { Store } from "../store.entity";
import { UpdateStoreDto } from "../dtos/update-store.dto";

export class UpdateStoreCommand extends Command<Store> {

  constructor(public readonly storeId: string, public readonly userId: string, public readonly payload: UpdateStoreDto) { super() }
}
