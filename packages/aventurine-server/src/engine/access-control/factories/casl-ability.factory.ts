import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { RolePermissions } from '../roles/roles.config';
import { Action, Subject } from '../enums/permissions.enum';

export type AppAbility = MongoAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
  createForRole(role: keyof typeof RolePermissions): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    RolePermissions[role].permissions.forEach((p) => {
      p.grant.forEach((g) => {
        can(g.action, g.subject);
      });

      p.deny?.forEach((d) => {
        cannot(d.action, d.subject);
      });
    });

    return build();
  }
}
