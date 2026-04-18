import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from 'bullmq'
import { Cron } from '@nestjs/schedule'
import { Injectable } from "@nestjs/common";
import { FILE_STORE_QUEUE, FileStoreQueue } from "../types/file-store-queue.type";

@Injectable()
export class FileStoreCron {
  constructor(@InjectQueue(FILE_STORE_QUEUE) private queue: Queue) {

  }
  @Cron("0 */30 9-17 * * *")
  async cleanup() {
    await this.queue.add(FileStoreQueue.CLEANUP, {})

  }
}
