import { Action, Subject } from '../enums/permissions.enum';
import { RoleObject } from './types/role-object.type';

export const RolePermissions: Record<string, RoleObject> = {
  owner: {
    label: 'owner',
    displayName: 'Owner',
    permissions: [{ grant: [{ action: Action.MANAGE, subject: Subject.ALL }] }],
    description: 'Full access to all resources and actions.',
  },
  contributor: {
    label: 'contributor',
    displayName: 'Contributor',
    permissions: [
      {
        grant: [{ action: Action.MANAGE, subject: Subject.ALL }],
        deny: [
          { action: Action.MANAGE, subject: Subject.USER },
          { action: Action.MANAGE, subject: Subject.STORE },
        ],
      },
    ],
    description: 'Can manage all resources except users and stores.',
  },

  cashier: {
    label: 'cashier',
    displayName: 'Cashier',
    permissions: [
      {
        grant: [
          { action: Action.READ, subject: Subject.PRODUCT },
          { action: Action.READ, subject: Subject.PRICE },
        ],
      },
    ],
    description: 'Can read products and prices, but cannot modify them.',
  },
} as const;

export type Role = keyof typeof RolePermissions;
