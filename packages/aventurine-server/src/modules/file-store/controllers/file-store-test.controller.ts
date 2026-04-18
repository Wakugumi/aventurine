import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { FileStoreService } from "../services/file-store.service";
import { FileContext } from "../enums/file-context.enum";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Response } from "express";
import { CreateUploadInstructionDto } from "../dtos/create-upload.dto";

@Controller("filestore-test")
export class FileStoreTestController {

  constructor(private readonly fileStoreService: FileStoreService) { }

  @Get()
  async getPage(@Res() res: Response): Promise<void> {
    const templatePath = join(__dirname, '..', 'static', 'file-store-test.page.html');
    const template = await readFile(templatePath, 'utf-8');

    const options = Object.values(FileContext)
      .map((context) => `<option value="${context}">${context}</option>`)
      .join('');

    const html = template.replace('__FILE_CONTEXT_OPTIONS__', options);
    res.type('html').send(html);
  }

  @Post('create-upload')
  createUploadInstruction(@Body() payload: CreateUploadInstructionDto) {
    return this.fileStoreService.createUpload(payload.referenceId, {
      fileName: payload.fileName,
      context: payload.context
    });
  }

}
