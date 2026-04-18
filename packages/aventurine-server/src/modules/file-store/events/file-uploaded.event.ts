import { FileContext } from "../enums/file-context.enum";

export class FileUploadedEvent {
  constructor(
    public readonly fileId: string,
    public readonly context: FileContext
  ) {
  }
}
