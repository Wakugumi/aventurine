import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SubmitProductCommand } from "../submit-product.command";
import { Product } from "../../product.entity";
import { ProductService } from "../../product.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@CommandHandler(SubmitProductCommand)
export class SubmitProductHandler implements ICommandHandler<SubmitProductCommand> {
  constructor(private readonly productService: ProductService,
    @InjectRepository(Product) private readonly repo: Repository<Product>
  ) {

  }


  async execute(command: SubmitProductCommand): Promise<Product> {

    await this.productService.submitProduct(command.productId, command.userId);
    return await this.repo.findOneByOrFail({ id: command.productId, ownerId: command.userId })
  }


}
