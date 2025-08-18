import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStore } from './user-store.entity';
import { Repository } from 'typeorm';
import { AssignUserStoreDto } from './dtos/assign-user-store.dto';
import {
  UserStoreException,
  UserStoreExceptionCode,
} from './exceptions/user-store.exception';
import { RolePermissions } from 'src/engine/access-control/roles/roles.config';

@Injectable()
export class UserStoreService {
  constructor(
    @InjectRepository(UserStore)
    private readonly userStoreRepo: Repository<UserStore>,
  ) {}

  async assignUserToStore(dto: AssignUserStoreDto) {
    const userstore = this.userStoreRepo.create({
      ...dto,
      assignedAt: new Date(),
    });
    return this.userStoreRepo.save(userstore);
  }

  async updateRole(dto: Partial<AssignUserStoreDto>) {
    const user = await this.userStoreRepo.findOne({
      where: { storeId: dto.storeId, userId: dto.userId },
    });

    if (!user) {
      throw new UserStoreException(
        'User Store not exist',
        UserStoreExceptionCode.USER_STORE_NOT_EXIST,
        'Cannot update role as user not exist inside this store',
      );
    }
    if (
      !Object.keys(RolePermissions).includes(dto.role!) ||
      dto.role === undefined ||
      dto.role == null
    ) {
      throw new UserStoreException(
        `${dto.role!} is an invalid role or not exist`,
        UserStoreExceptionCode.INVALID_ROLE,
      );
    }

    user.role = dto.role as string;
    return this.userStoreRepo.save(user);
  }
}
