import { CustomException } from 'src/utils/custom-exception';

export enum UserStoreExceptionCode {
  USER_STORE_NOT_EXIST = 'USER_STORE_NOT_EXIST',
  INVALID_ROLE = 'INVALID_ROLE',
}

export class UserStoreException extends CustomException {
  constructor(
    message: string,
    code: keyof typeof UserStoreExceptionCode,
    friendlyMessage?: string,
  ) {
    super(message, code, friendlyMessage);
  }
}
