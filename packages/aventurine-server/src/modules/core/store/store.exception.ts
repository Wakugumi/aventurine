import { CustomException } from 'src/utils/custom-exception';

export class StoreException extends CustomException {
  declare code: StoreExceptionCode;
  constructor(
    message: string,
    code: StoreExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: string } = {},
  ) {
    super(message, code, userFriendlyMessage);
  }
}

export enum StoreExceptionCode {
  STORE_NOT_FOUND = 'STORE_NOT_FOUND',
  STORE_ALREADY_EXISTS = 'STORE_ALREADY_EXISTS',
  STORE_INVALID_DATA = 'STORE_INVALID_DATA',
  STORE_OPERATION_FAILED = 'STORE_OPERATION_FAILED',
  STORE_UNAUTHORIZED_ACCESS = 'STORE_UNAUTHORIZED_ACCESS',
  STORE_FORBIDDEN_ACTION = 'STORE_FORBIDDEN_ACTION',
  STORE_INTERNAL_ERROR = 'STORE_INTERNAL_ERROR',
}
