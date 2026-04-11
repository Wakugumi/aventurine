import {
  BlobServiceClient,
  ContainerClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { StorageDriver } from '../types/storage-driver.interface';
import {
  StorageException,
  StorageExceptionCode,
} from '../types/storage.exception';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { AzureBlobOptions, SignedUrlResult } from '../types/storage.types';
import { Logger } from '@nestjs/common';
import { join } from 'path';

export class AzureDriver implements StorageDriver<NodeJS.ReadableStream> {
  private client: BlobServiceClient;
  private readonly logger = new Logger(AzureDriver.name);
  private container: ContainerClient;
  private options: AzureBlobOptions;
  private sharedKeyCredential: StorageSharedKeyCredential;

  constructor(options: AzureBlobOptions) {
    if (!options.accountKey) {
      throw new StorageException(
        "Only support authenticate with account key, usually paired with account name",
        StorageExceptionCode.INVALID_CONFIGURATION
      )
    }
    this.options = options;
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      options.accountName, options.accountKey
    )


    this.client = new BlobServiceClient(
      this.options.serviceUrl,
      this.sharedKeyCredential
    );

    this.container = this.client.getContainerClient(options.container);
  }

  async checkFileExists(params: {
    key: string
  }): Promise<boolean> {

    try {
      return await this.container.getBlockBlobClient(params.key).exists();
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async delete(params: {
    key: string
  }): Promise<void> {

    try {
      await this.container.getBlobClient(params.key).deleteIfExists();
    } catch (error) {
      throw error;
    }
  }

  async read(params:
    {
      key: string
    }) {

    try {
      const file = await this.container.getBlobClient(params.key).download();

      if (file.readableStreamBody === undefined) {
        throw new StorageException(
          'Cannot read file',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }
      return file.readableStreamBody;
    } catch (error) {
      if (error.code === 'ENOENT')
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );

      throw error;
    }
  }

  async write(params: {
    file: Buffer | Uint8Array | string;
    key: string,
    mimeType: string | undefined;
  }): Promise<void> {

    try {
      await this.container
        .getBlockBlobClient(params.key)
        .upload(params.file, params.file.length);
    } catch (error) {
      throw error;
    }
  }


  async move(params: { from: { key: string; }; to: { key: string; }; }): Promise<void> {

    const fromBlob = this.container.getBlockBlobClient(params.from.key);
    try {
      await this.copy(params);
      await fromBlob.delete();
    } catch (error) {
      throw error;
    }
  }

  async copy(params: { from: { key: string; }; to: { key: string; }; }): Promise<void> {

    const fromBlob = this.container.getBlockBlobClient(params.from.key);
    const toBlob = this.container.getBlockBlobClient(params.to.key);

    // check if destination already exist
    if (await toBlob.exists())
      throw new StorageException(
        'File already exist',
        StorageExceptionCode.FILE_ALREADY_EXISTS,
      );

    // check the file exist
    if ((await fromBlob.exists()) == false)
      throw new StorageException(
        'File not found',
        StorageExceptionCode.FILE_NOT_FOUND,
      );

    try {
      (await toBlob.beginCopyFromURL(fromBlob.url)).pollUntilDone();
    } catch (error) {
      throw error;
    }
  }

  async download(params: { from: { key: string; }; to: { key: string; }; }): Promise<void> {

    try {
      const fileStream = await this.read({
        key: params.from.key
      });

      await pipeline(fileStream, createWriteStream(params.to.key));
    } catch (error) {
      throw error;
    }
  }

  getSignedUrl(params: {
    key: string
    expiresInSeconds?: number;
  }): SignedUrlResult {
    const blobClient = this.container.getBlobClient(params.key);

    if (!this.sharedKeyCredential) {
      throw new StorageException(
        'Account key is required for generating signed URLs',
        StorageExceptionCode.FILE_NOT_FOUND,
      );
    }

    try {
      const expiresOn = new Date();
      expiresOn.setSeconds(
        expiresOn.getSeconds() + (params.expiresInSeconds || 3600),
      );

      const sasOptions = {
        containerName: this.options.container,
        blobName: params.key,
        permissions: BlobSASPermissions.parse('cw'), // create and write
        startsOn: new Date(),
        expiresOn,
      };

      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        this.sharedKeyCredential,
      ).toString();

      return {
        url: `${blobClient.url}?${sasToken}`,
        key: params.key,
        headers: {
          "x-ms-blob-type": "BlockBlob"
        }
      }
    } catch (error) {
      this.logger.error('Error generating signed URL:', error);
      throw new StorageException(
        `Failed to generate signed URL: ${error as string}`,
        StorageExceptionCode.INVALID_PARAMETERS,
      );
    }
  }

  getUrl(params: { key: string; signed?: boolean; expiresInSeconds?: number; }): string {


    if (!this.options.publicBaseUrl)
      throw new StorageException("This storage provider did not support public access", StorageExceptionCode.INVALID_CONFIGURATION)
    return join(this.options.publicBaseUrl, params.key)

  }


}
