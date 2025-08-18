import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../access-control/factories/casl-ability.factory';
import { CHECK_PERMISSION_KEY } from '../access-control/decorators/check-permission.decorator';
import { UserStore } from 'src/modules/core/user-store/user-store.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<{ action; subject }>(
      CHECK_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!required) {
      return true; // No permissions required, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user: UserStore = request.user; // auth guard

    const ability = this.caslFactory.createForRole(user.role);

    if (ability.can(required.action, required.subject)) {
      return true; // User has the required permission
    }
    throw new ForbiddenException(
      `You do not have permission to perform ${required.action} ${required.subject}`.trim(),
    );
  }
}
