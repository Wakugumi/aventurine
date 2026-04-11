import { dirname, join } from 'path';
import { StorageDriver } from '../types/storage-driver.interface';
import * as fs from 'fs/promises';
import {
  StorageException,
  StorageExceptionCode,
} from '../types/storage.exception';
import { createReadStream, existsSync } from 'fs';
import { Readable } from 'stream';

export interface LocalDriverOptions {
  storagePath: string;
  publicBaseUrl?: string;
}

export class LocalDriver implements StorageDriver<Readable, void, void, void, void, void, string, string> {
  private options: LocalDriverOptions;

  constructor(options: LocalDriverOptions) {
    this.options = options;
  }

  async createFolder(path: string) {
    await fs.mkdir(path, { recursive: true });
  }

  async write(params: {
    file: Buffer | Uint8Array | string;
    key: string;
    mimeType: string | undefined;
  }): Promise<void> {
    const filePath = join(
      `${this.options.storagePath}/${params.key}`,
    );

    const folderPath = dirname(filePath);
    await this.createFolder(folderPath);
    await fs.writeFile(filePath, params.file);
  }

  async move(params: {
    from: { key: string };
    to: { key: string };
  }): Promise<void> {
    const fromPath = join(
      `${this.options.storagePath}/`,
      params.from.key
    );

    const toPath = join(
      `${this.options.storagePath}/`,
      params.to.key
    );

    await this.createFolder(dirname(toPath)); // ensure folder exists, create if none

    try {
      await fs.rename(fromPath, toPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async copy(
    params: {
      from: { key: string };
      to: { key: string };
    },
    toInMemory: boolean = false,
  ): Promise<void> {
    const fromPath = join(
      this.options.storagePath,
      params.from.key,
    );

    const toPath = join(
      toInMemory ? '' : this.options.storagePath,
      params.to.key,
    );

    await this.createFolder(dirname(toPath));

    try {
      await fs.cp(fromPath, toPath, { recursive: true });
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }

      throw error;
    }
  }

  async download(params: {
    from: { key: string };
    to: { key: string };
  }): Promise<void> {
    await this.copy(params, true);
  }

  async checkFileExists(params: {
    key: string
  }): Promise<boolean> {
    const filePath = join(
      this.options.storagePath,
      params.key,
    );

    return existsSync(filePath);
  }

  async checkFolderExists(folderPath: string): Promise<boolean> {
    const fullPath = join(this.options.storagePath, folderPath);
    return existsSync(fullPath);
  }

  async read(params: {
    key: string
  }): Promise<Readable> {
    const filePath = join(
      this.options.storagePath,
      params.key
    );

    if (!existsSync(filePath)) {
      throw new StorageException(
        'File not found',
        StorageExceptionCode.FILE_NOT_FOUND,
      );
    }

    try {
      return createReadStream(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async delete(params: {
    key: string
  }): Promise<void> {
    const filePath = join(
      this.options.storagePath,
      params.key
    );

    await fs.rm(filePath, { recursive: true });
  }

  getSignedUrl(params: {
    key: string;
    expiresInSeconds?: number;
  }): string {
    // For local storage, we just return the public URL
    // In a real implementation, you might want to generate a temporary token
    // or use a different approach for local file access control
    const filePath = join(
      this.options.storagePath,
      params.key
    );

    // If publicBaseUrl is configured, use it
    if (this.options.publicBaseUrl) {
      const relativePath = filePath.replace(this.options.storagePath, '').replace(/^[\/\\]/, '');
      return `${this.options.publicBaseUrl}/${relativePath}`;
    }

    // Otherwise, return the local file path
    // Note: This is not a real "signed URL" but works for local development
    return filePath;
  }
}
