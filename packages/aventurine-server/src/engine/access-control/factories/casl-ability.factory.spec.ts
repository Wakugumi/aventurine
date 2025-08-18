import { Action, Subject } from '../enums/permissions.enum';
import { CaslAbilityFactory } from './casl-ability.factory';

describe('CASL Ability Factory', () => {
  let factory: CaslAbilityFactory;

  beforeEach(() => {
    factory = new CaslAbilityFactory();
  });

  it('properly create set of abilities for the role "cashier"', () => {
    const ability = factory.createForRole('cashier');

    expect(ability.can(Action.READ, Subject.PRICE)).toBe(true);
    expect(ability.can(Action.READ, Subject.PRODUCT)).toBe(true);
    expect(ability.can(Action.MANAGE, Subject.PRODUCT)).toBe(false);
  });
});
