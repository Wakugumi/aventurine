
import { Injectable } from "@nestjs/common";
import { FileKeyService } from "./file-key.service";
import { StorageService } from "src/engine/storage/services/storage.service";
import { FileContext } from "../enums/file-context.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { FileStore } from "../file-store.entity";
import { In, Repository } from "typeorm";
import { ResolveContentType } from "../utils/content-type-resolver.util";
import { FileStoreStatus } from "@aventurine/shared";
import { FileStoreException, FileStoreExceptionCode } from "../file-store.exception";
import { EventEmitter2 } from '@nestjs/event-emitter'
import { FileUploadedEvent } from "../events/file-uploaded.event";
import { FileEvents } from "../enums/file-event.enum";
import { SignedUrlResult } from "src/engine/storage/types/storage.types";

@Injectable()
export class FileStoreService {
  constructor(private readonly keyService: FileKeyService,
    private readonly storageService: StorageService,
    @InjectRepository(FileStore) private readonly fileRepo: Repository<FileStore>,
    private readonly eventEmitter: EventEmitter2) { }


  async createUpload(
    referenceId: string,
    params: {
      fileName: string,
      context: FileContext
    }
  ): Promise<{
    credentials: SignedUrlResult,
    fileId: string,
    fileKey: string
  }> {
    const fileKey = this.keyService.generateFileKey({ referenceId: referenceId, context: params.context, fileName: params.fileName });

    const signedUrl = this.storageService.getSignedUrl({ key: fileKey })

    const fileRecord = await this.fileRepo.save({
      contentType: ResolveContentType(this.keyService.getFileExtension(params.fileName)),
      key: fileKey,
      status: FileStoreStatus.PENDING,
      context: params.context,
      referenceId: referenceId
    })



    return {
      credentials: signedUrl,
      fileId: fileRecord.id,
      fileKey: fileKey
    }

  }


  async confirmUpload(params: { fileId: string, fileKey: string }) {
    const isExists = await this.storageService.checkFileExists({ key: params.fileKey });

    if (!isExists)
      throw new FileStoreException("File blob not found, maybe the upload haven't yet succeeded", FileStoreExceptionCode.FILE_BLOB_NOT_FOUND)


    const fileRecord = await this.fileRepo.findOneByOrFail({ id: params.fileId, status: FileStoreStatus.PENDING });

    await this.fileRepo.update({ id: fileRecord.id }, {
      status: FileStoreStatus.ACTIVE
    })

    this.eventEmitter.emit(FileEvents.UPLOADED, new FileUploadedEvent(fileRecord.id, fileRecord.context));

    return {
      fileId: fileRecord.id,
      fileKey: fileRecord.key
    }
  }

  /**
  * File is marked with soft delete
  * Deletion issued by running cron job
  */
  async markDeleteFile(params: { fileId: string, referenceId: string }) {
    const file = await this.fileRepo.findOneBy({ id: params.fileId });
    if (!file) throw new FileStoreException("No File record found", FileStoreExceptionCode.FILE_RECORD_NOT_FOUND)
    await this.fileRepo.update({ id: params.fileId, referenceId: params.referenceId }, { status: FileStoreStatus.DELETE })


    this.eventEmitter.emit(FileEvents.DELETED, new FileUploadedEvent(file.id, file.context));
  }


  async immediateDeleteFile(params: { referenceId: string, fileId: string }) {
    const fileRecord = await this.fileRepo.findOneBy({ id: params.fileId, referenceId: params.referenceId })

    if (!fileRecord)
      throw new FileStoreException("File record not found, could be reference id mismatch", FileStoreExceptionCode.FILE_RECORD_NOT_FOUND)

    await this.storageService.delete({ key: fileRecord.key });


    await this.fileRepo.delete({ id: fileRecord.id })

    this.eventEmitter.emit(FileEvents.DELETED, new FileUploadedEvent(fileRecord.id, fileRecord.context));

    return fileRecord
  }

  async getFile(params: { referenceId: string, fileId: string }): Promise<FileStore> {
    const fileRecord = await this.fileRepo.findOneBy({ id: params.fileId, referenceId: params.referenceId })

    if (!fileRecord)
      throw new FileStoreException("File record not found", FileStoreExceptionCode.FILE_RECORD_NOT_FOUND)

    return fileRecord;
  }

  async getBulkFiles(params: { referenceIds: string[], context: FileContext, status: FileStoreStatus }): Promise<FileStore[]> {
    return await this.fileRepo.find({
      where: {
        context: params.context,
        referenceId: In(params.referenceIds),
        status: params.status
      }
    });

  }



  getPublicUrl(fileKey: string) {
    return this.storageService.getUrl({ key: fileKey })
  }

}
