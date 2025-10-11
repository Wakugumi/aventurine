/**
 * Service class for User module.
 * User Service provide isolated use case as a function for what the client can do to the User entity.
 * With this, the client can command:
 *  - query records of users (developers)
 *  - query a record of user (command like me, auth, profile query)
 *  - register new standalone user (a standalon user is a user account that is registered on the platform or by seeding for self-hosted)
 *  - register user in-store (a in-store user is user accounts that is registered by an standalone user, associated to a store or many store)
 *  - update user metadata
 *  - destroy in-store user entity
 *
 * with prohibitions:
 *  - destroy standalone user (TODO: Should be a new feature later, since the current project aim for self-hosted)
 *
 * Written by Ananda Risyad (https://github.com/Wakugumi)
 */

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserException, UserExceptionCode } from './user.exception';
import { AventurineConfigService } from 'src/engine/aventurine-config/aventurine-config.service';
import { StorageService } from 'src/engine/storage/services/storage.service';
import { StoragePath } from 'src/engine/storage/utils/storage-path.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: AventurineConfigService,
    private readonly storageService: StorageService,
  ) { }

  /**
   * Return all object of User record(s)
   */
  findAll() {
    return this.userRepository.find();
  }

  /**
   * Return single record of User with condition of id equality
   */
  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Update a User record
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: new Date(),
    });
    return this.findOne(id);
  }

  /**
   * Create new User
   */
  async create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);

    return this.userRepository.save(user);
  }

  async getAvatarUrl(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user)
      throw new UserException(
        'User not found',
        UserExceptionCode.USER_NOT_FOUND,
      );

    return this.storageService.getUrl({ key: user.avatar as string });
  }

  private generateAvatarFilename(userId: string) {
    return StoragePath.joinPaths(
      StoragePath.userAvatar(userId),
      `avatar_${userId}`,
    );
  }

  async generateHash(password: string) {
    const isValid = PASSWORD_REG
  }
}
