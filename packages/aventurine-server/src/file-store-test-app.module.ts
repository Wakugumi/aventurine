import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './engine/storage/storage.module';
import { QueueModule } from './engine/queue/queue.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FileStoreModule } from './modules/file-store/file-store.module';
import { AventurineConfigModule } from './engine/aventurine-config/aventurine-config.module';

@Module({
  imports: [
    StorageModule.forRoot(),
    QueueModule,
    DatabaseModule,
    EventEmitterModule.forRoot(),
    FileStoreModule,
  ],
})
export class FileStoreTestAppModule { }
