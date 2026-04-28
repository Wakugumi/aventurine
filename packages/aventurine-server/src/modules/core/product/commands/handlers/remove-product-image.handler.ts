import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { RemoveProductImageCommand } from "../remove-product-image.command";
import { Product } from "../../product.entity";
import { ProductService } from "../../product.service";
import { GetProductQuery } from "../../queries/get-product.query";

@CommandHandler(RemoveProductImageCommand)
export class RemoveProductImageHandler implements ICommandHandler<RemoveProductImageCommand> {

  constructor(private readonly productService: ProductService, private readonly queryBus: QueryBus) { }


  async execute(command: RemoveProductImageCommand): Promise<Product> {
    await this.productService.removeImage(command.productId, command.userId, command.fileId);

    return await this.queryBus.execute<GetProductQuery>(
      new GetProductQuery(command.productId, command.userId)
    )
  }

}
