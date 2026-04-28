import { Command } from "@nestjs/cqrs";
import { Product } from "../product.entity";

export class RemoveProductImageCommand extends Command<Product> {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly fileId: string

  ) { super(); }
}
