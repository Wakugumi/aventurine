import { CustomException } from "src/utils/custom-exception";

export class FileStoreException extends CustomException {

  constructor(message: string, code: FileStoreExceptionCode) {
    super(message, code);

  }

}

export enum FileStoreExceptionCode {
  FILE_RECORD_NOT_FOUND = "FILE_RECORD_NOT_FOUND",
  FILE_BLOB_NOT_FOUND = "FILE_BLOB_NOT_FOUND"

}
