import { User } from 'src/modules/core/user/user.entity';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  UPDATE = 'update',
  READ = 'read',
  DELETE = 'delete',
}

export enum Subject {
  ALL = 'all',
  USER = 'user',
  PRODUCT = 'product',
  STORE = 'store',
  PRICE = 'price',
}

export type PermissionPair = {
  action: Action;
  subject: Subject;
};

export type Permission = {
  grant: PermissionPair[];
  deny?: PermissionPair[];
};
