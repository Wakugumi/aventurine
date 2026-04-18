import { Controller, Post, Body } from "@nestjs/common";
import { FileStoreService } from "./services/file-store.service";
import { UploadConfirmDto } from "./dtos/upload-confirm.dto";
import { ApiBody } from "@nestjs/swagger";
import { CreateUploadInstructionDto } from "./dtos/create-upload.dto";

@Controller("file")
export class FileStoreController {

  constructor(private readonly fileService: FileStoreService) { }

  @Post('confirm/:id')
  @ApiBody({ type: UploadConfirmDto })
  async confirm(@Body() payload: UploadConfirmDto) {
    return await this.fileService.confirmUpload({ fileId: payload.fileId, fileKey: payload.fileKey })
  }


  @Post("upload")
  createUploadInstruction(@Body() payload: CreateUploadInstructionDto) {
    return this.fileService.createUpload(payload.referenceId, {
      fileName: payload.fileName,
      context: payload.context
    });

  }
}
