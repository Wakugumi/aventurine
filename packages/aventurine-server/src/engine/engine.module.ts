import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { AventurineConfigService } from './aventurine-config/aventurine-config.service';
import { LoggerModule } from './logger/logger.module';
import { loggerModuleFactory } from './logger/logger.module-factory';
import { ACLModule } from './access-control/acl.module';

@Module({
  imports: [
    ACLModule,
    StorageModule.forRoot(),
    LoggerModule.forRootAsync({
      useFactory: loggerModuleFactory,
      inject: [AventurineConfigService],
    }),
  ],
})
export class EngineModule {}
