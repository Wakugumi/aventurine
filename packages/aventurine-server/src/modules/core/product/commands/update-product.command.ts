import { Command } from "@nestjs/cqrs";
import { Product } from "../product.entity";
import { DeepPartial } from "typeorm";

export class UpdateProductCommand extends Command<Product> {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly payload: DeepPartial<Product>

  ) { super() }
}
