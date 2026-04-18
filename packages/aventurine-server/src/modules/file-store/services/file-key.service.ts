import { Injectable } from "@nestjs/common";
import { FileContext } from "../enums/file-context.enum";
import { uuidv4 } from "zod";

interface GenerateFileKeyParams {
  referenceId?: string
  fileName: string;
  context: FileContext

}

@Injectable()
export class FileKeyService {
  constructor() { }

  getFileExtension(fileName: string): string {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }


  generateFileKey(params: GenerateFileKeyParams): string {

    const ext = this.getFileExtension(params.fileName);
    const uuid = uuidv4();
    const timestamp = Date.now()


    switch (params.context) {
      case FileContext.AVATAR:
        return `uploads/avatar/${params.referenceId}/${timestamp}-${uuid}.${ext}`;


      case FileContext.PRODUCT:
        return `uploads/product/${params.referenceId}/${timestamp}-${uuid}.${ext}`

      case FileContext.SYSTEM:
        return `system/${params.fileName}`

      default:
        throw new Error(`Unrecognized file context ${params.context}`)
    }

  }


  getContextDirectory(context: FileContext, params: {

    referenceId?: string
  }) {

    switch (context) {
      case FileContext.AVATAR:
        if (!params.referenceId) throw new Error(`Reference ID is required for context ${context}`)
        return `uploads/avatar/${params.referenceId}/`;


      case FileContext.PRODUCT:
        if (!params.referenceId) throw new Error(`Reference ID is required for context ${context}`)
        return `uploads/product/${params.referenceId}/`;

      case FileContext.SYSTEM:
        return `system/`
    }
  }


}
