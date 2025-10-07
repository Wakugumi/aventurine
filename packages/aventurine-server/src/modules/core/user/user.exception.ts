import { CustomException } from 'src/utils/custom-exception';

export class UserException extends CustomException {
  constructor(message: string, code: UserExceptionCode, friendly?: string) {
    super(message, code, friendly);
  }
}

export enum UserExceptionCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  UPDATE_AVATAR_LIMIT = 'UPDATE_AVATAR_LIMIT',
  AVATAR_BUCKET_ERROR = 'AVATAR_BUCKET_ERROR',
}
