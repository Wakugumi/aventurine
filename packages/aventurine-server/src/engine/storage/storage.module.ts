import { DynamicModule, Global, Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageTestController } from './controllers/test.controller';
import { AventurineConfigModule } from '../aventurine-config/aventurine-config.module';
import { AventurineConfigService } from '../aventurine-config/aventurine-config.service';
import { StorageDriverFactory } from './storage-driver.factory';
import { STORAGE_OPTIONS, STORAGE_STRATEGY } from './types/storage.tokens';

@Global()
export class StorageModule {
  static forRoot(): DynamicModule {
    return {
      module: StorageModule,
  imports: [AventurineConfigModule.forRoot()],
      providers: [
        StorageDriverFactory,
        // provide STORAGE_OPTIONS token so StorageService can inject configuration
        {
          provide: STORAGE_OPTIONS,
          useFactory: (config: AventurineConfigService) => {
            // shape expected by StorageService is any; include commonly used options
            return {
              options: {
                publicBaseUrl: config.get('STORAGE_PUBLIC_BASE_URL'),
              },
            };
          },
          inject: [AventurineConfigService],
        },
        // provide STORAGE_STRATEGY if consumers need bit
        {
          provide: STORAGE_STRATEGY,
          useFactory: (config: AventurineConfigService) =>
            config.get('STORAGE_TYPE'),
          inject: [AventurineConfigService],
        },
        StorageService,
      ],
      controllers: [StorageTestController],
      exports: [StorageService],
    };
  }
}
