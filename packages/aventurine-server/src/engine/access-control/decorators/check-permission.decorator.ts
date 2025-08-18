import { SetMetadata } from '@nestjs/common';
import { Action, Subject } from '../enums/permissions.enum';

export const CHECK_PERMISSION_KEY = 'check_permissions';

export const CheckPermissions = (action: Action, subject: Subject) => {
  SetMetadata(CHECK_PERMISSION_KEY, { action, subject });
};
