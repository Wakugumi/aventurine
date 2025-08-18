import { UserException, UserExceptionCode } from './user.exception';
import { CustomException } from 'src/utils/custom-exception';
import { User } from './user.entity';
import { isDefined } from 'class-validator';

const assertIsDefinedOrThrow = (
  user: User | undefined | null,
  exceptionToThrow: CustomException = new UserException(
    'User not found',
    UserExceptionCode.USER_NOT_FOUND,
  ),
): asserts user is User => {
  if (!isDefined(user)) {
    throw exceptionToThrow;
  }
};

const isUserDefined = (user: User | undefined | null): user is User => {
  return isDefined(user);
};

export const userValidator: {
  assertIsDefinedOrThrow: typeof assertIsDefinedOrThrow;
  isDefined: typeof isUserDefined;
} = {
  assertIsDefinedOrThrow,
  isDefined: isUserDefined,
};
