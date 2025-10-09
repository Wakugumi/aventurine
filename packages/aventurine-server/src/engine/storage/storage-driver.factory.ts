import { resolveAbsolutePath } from 'src/utils/resolve-absolute-path.util';
import { AventurineConfigService } from '../aventurine-config/aventurine-config.service';
import { DynamicFactoryBase } from '../aventurine-config/dynamic-factory.base';
import { ConfigVariablesGroup } from '../aventurine-config/enums/config-variables-group.enum';
import { LocalDriver } from './drivers/local.driver';
import { StorageDriver } from './types/storage-driver.interface';
import { StorageDriverOptions } from './types/storage.types';
import { AzureDriver } from './drivers/azure.driver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageDriverFactory extends DynamicFactoryBase<StorageDriver> {
  constructor(configService: AventurineConfigService) {
    super(configService);
  }

  protected buildConfigKey(): string {


    const storageType = this.configService.get('STORAGE_TYPE');

    if (storageType == StorageDriverOptions.LOCAL) {
      const storagePath = this.configService.get('STORAGE_LOCAL_PATH');

      return `local|${storagePath}`;
    }

    if (storageType == StorageDriverOptions.AZURE) {
      const storageConfigHash = this.getConfigGroupHash(
        ConfigVariablesGroup.StorageConfig,
      );

      return `azure|${storageConfigHash}`;
    }

    throw new Error(`Unsuported storage type: ${storageType}`);
  }

  protected createDriver(): StorageDriver {
    const storageType = this.configService.get('STORAGE_TYPE');

    switch (storageType) {
      case StorageDriverOptions.LOCAL:
        const storagePath = this.configService.get('STORAGE_LOCAL_PATH');
        return new LocalDriver({
          storagePath: resolveAbsolutePath(storagePath),
        });

      case StorageDriverOptions.AZURE:
        const accountName = this.configService.get(
          'STORAGE_AZURE_ACCOUNT_NAME',
        );
        const accountKey = this.configService.get('STORAGE_AZURE_ACCOUNT_KEY');
        const containerName = this.configService.get(
          'STORAGE_AZURE_CONTAINER_NAME',
        );
        const connString = this.configService.get(
          'STORAGE_AZURE_CONNECTION_STRING',
        );
        return new AzureDriver({
          accountName: accountName,
          accountKey: accountKey,
          container: containerName,
          connectionString: connString,
        });
    }
  }
}
