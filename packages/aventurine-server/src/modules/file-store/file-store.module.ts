import { Module } from "@nestjs/common";
import { FileKeyService } from "./services/file-key.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileStore } from "./file-store.entity";
import { FileStoreService } from "./services/file-store.service";
import { BullModule } from "@nestjs/bullmq";
import { FILE_STORE_QUEUE } from "./types/file-store-queue.type";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { FileStoreController } from "./file-store.controller";
import { FileStoreTestController } from "./controllers/file-store-test.controller";

@Module({
  imports: [TypeOrmModule.forFeature([FileStore]), BullModule.registerQueue({ name: FILE_STORE_QUEUE }), EventEmitterModule],
  controllers: [FileStoreController, FileStoreTestController],
  providers: [FileKeyService, FileStoreService],
  exports: [FileKeyService, FileStoreService, FileStoreModule]
})
export class FileStoreModule {

}
