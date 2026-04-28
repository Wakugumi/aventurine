import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProductCommand } from "../update-product.command";
import { Product } from "../../product.entity";
import { ProductService } from "../../product.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductException, ProductExceptionCode } from "../../product.exception";

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {

  constructor(private readonly productService: ProductService,
    @InjectRepository(Product) private readonly repo: Repository<Product>) { }
  async execute(command: UpdateProductCommand): Promise<Product> {
    console.log(command.payload)
    const result = await this.productService.updateProduct(command.productId, command.userId, command.payload)
    console.log(result)

    if (result.affected && result.affected <= 0)
      throw new ProductException("Update failed", ProductExceptionCode.UPDATE_FAILED)

    return await this.repo.findOneByOrFail({ id: command.productId })



  }

}
