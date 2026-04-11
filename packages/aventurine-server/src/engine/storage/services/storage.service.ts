import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_OPTIONS, STORAGE_STRATEGY } from '../types/storage.tokens';
import { ContentTypes, GetUrlOptions, SignedUrlResult } from '../types/storage.types';
import { StorageDriver } from '../types/storage-driver.interface';
import { Readable } from 'stream';
import { StorageDriverFactory } from '../storage-driver.factory';
import { StorageException, StorageExceptionCode } from '../types/storage.exception';

@Injectable()
export class StorageService implements StorageDriver {
  private driver: StorageDriver;
  constructor(
    private readonly storageFactory: StorageDriverFactory,
    @Inject(STORAGE_OPTIONS) private readonly options: any,
  ) {
    this.driver = storageFactory.getCurrentDriver();
  }

  private splitKey(key: string): { folder: string; name: string } {
    const normalized = key.replace(/^\/+|\/+$/g, '');
    const lastSlashIdx = normalized.lastIndexOf('/');
    if (lastSlashIdx === -1) return { folder: '', name: normalized };
    return {
      folder: normalized.substring(0, lastSlashIdx),
      name: normalized.substring(lastSlashIdx + 1),
    };
  }

  read(params: {
    key: string
  }): Promise<Readable | ReadableStream | NodeJS.ReadableStream | undefined> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.read(params);
  }

  write(params: {
    file: Buffer | Uint8Array | string;
    key: string;
    mimeType: ContentTypes | undefined;
  }): Promise<void> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.write(params);
  }

  async delete(params: {
    key: string
  }): Promise<void> {
    await this.driver.delete(params);
  }

  move(params: {
    from: { key: string },
    to: { key: string }
  }): Promise<void> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.move(params);
  }

  copy(params: {
    from: { key: string },
    to: {
      key: string
    }
  }): Promise<void> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.copy(params);
  }

  download(params: {
    from: { key: string };
    to: { key: string };
  }) {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.download(params);
  }

  checkFileExists(params: {
    key: string
  }): Promise<boolean> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.checkFileExists(params);
  }

  getSignedUrl(params: { key: string; expiresInSeconds?: number; }): SignedUrlResult {
    if (this.driver.getSignedUrl)
      return this.driver.getSignedUrl(params)

    throw new StorageException("This storage does not support signed url", StorageExceptionCode.INVALID_CONFIGURATION)
  }

  getUrl(
    params: {
      key: string,
      signed?: boolean,

      expiresInSeconds?: number;
    }

  ): string {
    return this.buildPublicUrl(params.key);
  }

  private buildPublicUrl(key: string): string {
    const publicBaseUrl: string | undefined =
      this.options?.options?.publicBaseUrl;
    if (!publicBaseUrl) throw new StorageException("This storage provider does not support public access", StorageExceptionCode.INVALID_CONFIGURATION)
    const normalizedKey = key.replace(/^\/+/, '');
    return `${publicBaseUrl.replace(/\/$/, '')}/${normalizedKey}`;
  }
}
