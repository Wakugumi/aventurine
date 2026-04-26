import { Processor, Process } from "@nestjs/bull";
import { FILE_STORE_QUEUE, FileStoreQueue } from "../types/file-store-queue.type";
import { Job } from "bullmq";
import { FileStoreService } from "../services/file-store.service";
import { InjectRepository } from "@nestjs/typeorm";
import { FileStore } from "../file-store.entity";
import { LessThan, Repository } from "typeorm";
import { FileStoreStatus } from "@aventurine/shared";

@Processor(FILE_STORE_QUEUE)
export class FileStoreJobs {

  constructor(private readonly fileService: FileStoreService,
    @InjectRepository(FileStore) private readonly repo: Repository<FileStore>) { }

  @Process(FileStoreQueue.CLEANUP)
  async cleanup() {

    const now = new Date();

    // Expire long-pending uploads (example: older than 30 min)
    const pending = await this.repo.find({
      where: {
        status: FileStoreStatus.PENDING,
        createdAt: LessThan(new Date(now.getTime() - 30 * 60 * 1000)),
      },
    });

    for (const file of pending) {
      file.status = FileStoreStatus.DELETE
      await this.repo.save(file);
    }
    // Items explicitly marked for remove
    const toDelete = await this.repo.find({
      where: { status: FileStoreStatus.DELETE },
    });

    for (const file of toDelete) {
      await this.fileService.immediateDeleteFile({ fileId: file.id, referenceId: file.referenceId })
    }

    return { pending: pending.length };

  }
}
