import { Test, TestingModule } from '@nestjs/testing';
import { Store } from '../store/store.entity';
import { User } from '../user/user.entity';
import { UserStoreService } from './user-store.service';
import { UserStore } from './user-store.entity';
import { RolePermissions } from 'src/engine/access-control/roles/roles.config';
import {
  MockType,
  repositoryFactoryMock,
} from 'src/modules/utils/mocks/repository-factory.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignUserStoreDto } from './dtos/assign-user-store.dto';
import { UserStoreException } from './exceptions/user-store.exception';

describe('UserStore Service', () => {
  let user: User;
  let store: Store;

  let service: UserStoreService;
  let repoMock: MockType<Repository<UserStore>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserStoreService,
        {
          provide: getRepositoryToken(UserStore),
          useFactory: repositoryFactoryMock,
        },
      ],
    }).compile();

    service = module.get<UserStoreService>(UserStoreService);
    repoMock = module.get(getRepositoryToken(UserStore));
  });

  beforeAll(() => {
    user = new User();
    user.username = 'test';
    user.id = '1';

    store = new Store();
    store.id = '1';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Assign new user to a store', async () => {
    const data: AssignUserStoreDto = {
      userId: user.id,
      storeId: store.id,
      role: RolePermissions.owner.label,
    };
    repoMock.save?.mockReturnValueOnce(data);

    const spy = jest.spyOn(repoMock, 'save');
    const result = await service.assignUserToStore(data);
    expect(spy).toHaveBeenCalled();
    expect(result).toMatchObject(data);
  });

  it('Updates existing user role', async () => {
    const existing: Partial<UserStore> = {
      userId: '1',
      storeId: '1',
      role: RolePermissions.owner.label,
    };

    const update: Partial<AssignUserStoreDto> = {
      ...existing,
      role: RolePermissions.cashier.label,
    };

    repoMock.findOne?.mockReturnValueOnce(existing);
    await expect(service.updateRole(update)).resolves.toEqual(update);
    expect(repoMock.findOne).toHaveBeenCalledWith({
      where: {
        storeId: existing.storeId,
        userId: existing.userId,
      },
    });
    expect(repoMock.save).toHaveBeenCalledWith(update);
  });

  it('Should throw error on updating role for non-existing user store', async () => {
    const update: Partial<AssignUserStoreDto> = {
      role: 'owner',
    };
    repoMock.findOne?.mockReturnValueOnce(undefined);

    await expect(service.updateRole(update)).rejects.toThrow();
  });
});
