import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadProductImageCommmand } from "../upload-product-image.command";
import { ProductService } from "../../product.service";
import { SignedUrlResult } from "src/engine/storage/types/storage.types";

@CommandHandler(UploadProductImageCommmand)
export class UploadProductImageHandler implements ICommandHandler<UploadProductImageCommmand> {
  constructor(private readonly productService: ProductService) { }

  async execute(command: UploadProductImageCommmand): Promise<{
    credentials: SignedUrlResult,
    fileId: string,
    fileKey: string
  }> {
    return await this.productService.uploadImage(command.productId, command.userId, command.filename)
  }

}
