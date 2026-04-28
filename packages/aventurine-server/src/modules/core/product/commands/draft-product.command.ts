import { Command } from "@nestjs/cqrs";
import { Product } from "../product.entity";

export class DraftProductCommand extends Command<Product> {
  constructor(
    public readonly userId: string
  ) {
    super()
  }

}
