import { Readable } from 'stream';
import { ContentTypes, SignedUrlResult } from './storage.types';

export interface StorageDriver<TRead = Readable, TDelete = void, TWrite = void, TMove = void, TCopy = void, TDownload = void, TSignUrl = SignedUrlResult, TUrl = string> {
  delete(params: { key: string }): Promise<TDelete>;

  read(params: {
    key: string

  }): Promise<TRead | Readable | ReadableStream | NodeJS.ReadableStream | undefined>;

  write(params: {
    file: Buffer | Uint8Array | string;
    key: string;
    mimeType: ContentTypes | undefined;
  }): Promise<TWrite>;

  move(params: {
    from: { key: string };
    to: { key: string };
  }): Promise<TMove>;

  copy(params: {
    from: { key: string };
    to: { key: string };
  }): Promise<TCopy>;

  download(params: {
    from: { key: string };
    to: { key: string };
  }): Promise<TDownload>;

  checkFileExists(params: {
    key: string
  }): Promise<boolean>;

  getSignedUrl?(params: {
    key: string
    expiresInSeconds?: number;
  }): TSignUrl;

  getUrl?(params: {
    key: string,
    signed?: boolean;
    expiresInSeconds?: number
  }): TUrl;
}
