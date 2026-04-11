import { AventurineConfigService } from '../aventurine-config/aventurine-config.service';
import { DynamicFactoryBase } from '../aventurine-config/dynamic-factory.base';
import { ConfigVariablesGroup } from '../aventurine-config/enums/config-variables-group.enum';
import { StorageDriver } from './types/storage-driver.interface';
import { StorageDriverOptions } from './types/storage.types';
import { AzureDriver } from './drivers/azure.driver';
import { Injectable } from '@nestjs/common';
import { StorageException, StorageExceptionCode } from './types/storage.exception';

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

      case StorageDriverOptions.AZURE:
        const accountName = this.configService.get(
          'STORAGE_AZURE_ACCOUNT_NAME',
        );
        const accountKey = this.configService.get('STORAGE_AZURE_ACCOUNT_KEY');
        const containerName = this.configService.get(
          'STORAGE_AZURE_CONTAINER_NAME',
        );
        const serviceUrl = this.configService.get("STORAGE_AZURE_SERVICE_URL")
        const publicBaseUrl = this.configService.get("STORAGE_PUBLIC_BASE_URL")
        return new AzureDriver({
          accountName: accountName,
          accountKey: accountKey,
          container: containerName,
          serviceUrl: serviceUrl,
          publicBaseUrl: publicBaseUrl
        });

      default:
        throw new StorageException(`The storage type of ${storageType} is not supported yet`, StorageExceptionCode.INVALID_CONFIGURATION)
    }
  }
}
