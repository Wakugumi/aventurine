import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateStoreCommand } from "../create-store.command";
import { Store } from "../../store.entity";
import { StoreService } from "../../store.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@CommandHandler(CreateStoreCommand)
export class CreateStoreHandler implements ICommandHandler<CreateStoreCommand> {

  constructor(private readonly storeService: StoreService, @InjectRepository(Store) private readonly repo: Repository<Store>) {

  }

  async execute(command: CreateStoreCommand): Promise<Store> {

    const isExists = await this.repo.existsBy({ label: command.label })

    if (isExists) throw new Error(`Store with label ${command.label} already exist`);

    return await this.storeService.create(command.userId, { label: command.label });

  }

}
