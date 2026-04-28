import { Command } from "@nestjs/cqrs";
import { Product } from "../product.entity";

export class SubmitProductCommand extends Command<Product> {
  constructor(
    public readonly productId: string,
    public readonly userId: string
  ) {
    super();
  }
}
