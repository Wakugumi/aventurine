import { Permission } from '../../enums/permissions.enum';

export type RoleObject = {
  label: string;
  displayName: string;
  permissions: Permission[];
  description?: string | null;
};
