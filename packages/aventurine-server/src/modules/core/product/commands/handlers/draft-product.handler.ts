import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DraftProductCommand } from "../draft-product.command";
import { Product } from "../../product.entity";
import { ProductService } from "../../product.service";
import { random } from "lodash";
import { randomUUID } from "crypto";

@CommandHandler(DraftProductCommand)
export class DraftProductHandler implements ICommandHandler<DraftProductCommand> {


  constructor(private readonly productService: ProductService) { }


  async execute(command: DraftProductCommand): Promise<Product> {

    return await this.productService.createProduct({
      label: randomUUID(),
      ownerId: command.userId
    })

  }

} 
