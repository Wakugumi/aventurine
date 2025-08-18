import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CaslAbilityFactory } from '../access-control/factories/casl-ability.factory';
import { Action, Subject } from '../access-control/enums/permissions.enum';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let caslFactory: CaslAbilityFactory;

  beforeEach(() => {
    reflector = new Reflector();
    caslFactory = new CaslAbilityFactory();
    guard = new PermissionsGuard(reflector, caslFactory);
  });

  function createMockContext(userRole: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: userRole } }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as any as ExecutionContext;
  }

  it('should allow if permission exists', async () => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue({ action: Action.READ, subject: Subject.PRODUCT });
    const context = createMockContext('cashier');
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should deny if permission does not exist', async () => {
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue({ action: Action.UPDATE, subject: Subject.PRODUCT });
    const context = createMockContext('cashier');
    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
