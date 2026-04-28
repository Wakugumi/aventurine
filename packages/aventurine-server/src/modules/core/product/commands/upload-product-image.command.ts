import { ContentType } from "@aventurine/shared";
import { Command } from "@nestjs/cqrs";
import { SignedUrlResult } from "src/engine/storage/types/storage.types";

export class UploadProductImageCommmand extends Command<{
  credentials: SignedUrlResult,
  fileId: string,
  fileKey: string
}> {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly filename: string,
    public readonly contentType?: ContentType
  ) {
    super();
  }
}
