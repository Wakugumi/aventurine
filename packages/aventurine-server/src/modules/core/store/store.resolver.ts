import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Store } from './store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from './store.service';
import { UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/engine/guards/permissions.guard';
import { User } from '../user/user.entity';
import { isDefined } from 'class-validator';
import { StoreException, StoreExceptionCode } from './store.exception';
import { UserStoreService } from '../user-store/user-store.service';
import { UserStore } from '../user-store/user-store.entity';

@Resolver(() => Store)
export class StoreResolver {
  constructor(
    @InjectRepository(Store, 'core')
    private readonly storeService: StoreService,
    private readonly userStoreService: UserStoreService,
  ) {}

  @Query(() => Store)
  @UseGuards(PermissionsGuard)
  async store(@Args('id', { type: () => String }) id: string) {
    const store = await this.storeService.findOne(id);

    if (!isDefined(store)) {
      throw new StoreException(
        'Store not found',
        StoreExceptionCode.STORE_NOT_FOUND,
      );
    }

    return store;
  }

  @ResolveField(() => [UserStore], { nullable: true })
  async members(@Parent() store: Store): Promise<UserStore[]> {
    const { id } = store;

    const members = await this.userStoreService.findByStore(id);

    return members;
  }
}
