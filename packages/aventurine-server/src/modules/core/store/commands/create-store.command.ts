import { Command } from "@nestjs/cqrs"
import { Store } from "../store.entity"

export class CreateStoreCommand extends Command<Store> {
  constructor(
    public readonly userId: string,
    public readonly label: string,
  ) { super(); }
}
