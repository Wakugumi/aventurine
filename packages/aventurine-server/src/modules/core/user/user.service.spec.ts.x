import {
  MockType,
  repositoryFactoryMock,
} from 'src/modules/utils/mocks/repository-factory.mock';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hash } from 'crypto';
import { CreateUserDto } from './dtos/create-user.dto';
import { ValidationError } from 'class-validator';
import { ContentTypes } from 'src/engine/storage/types/storage.types';
import { StorageService } from 'src/engine/storage/services/storage.service';
import { StoredFile } from 'src/engine/storage/types/storage.types';
import { ConfigService } from '@nestjs/config';
import { UserException, UserExceptionCode } from './user.exception';
import { AventurineConfigService } from 'src/engine/aventurine-config/aventurine-config.service';
import { EnvironmentConfigDriver } from 'src/engine/aventurine-config/drivers/environment-config.driver';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from 'src/engine/aventurine-config/constants/config-variables-instance.constant';
import { ConfigVariables } from 'src/engine/aventurine-config/config-variables';
import {
  STORAGE_OPTIONS,
  STORAGE_STRATEGY,
} from 'src/engine/storage/types/storage.tokens';
import { StorageModule } from 'src/engine/storage/storage.module';
describe('User Service', () => {
  let user: User;
  let storageMock: MockType<StorageService>;
  let service: UserService;
  let repoMock: MockType<Repository<User>>;
  let configMock: MockType<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AventurineConfigService,
        ConfigService,
        EnvironmentConfigDriver,
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryFactoryMock,
        },
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repoMock = module.get(getRepositoryToken(User));
    storageMock = module.get(StorageService);
    configMock = module.get(ConfigService);
  });

  beforeAll(async () => {
    user = {
      id: crypto.randomUUID(),
      email: 'janedoe@mail.com',
      fullName: 'Jane Doe',
      isEmailVerified: true,
      isOwner: true,
      passwordHash: hash('sha512', 'helloworld').toString(),
      username: 'janedoe',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // create()
  it('should create an new user successfuly', async () => {
    const data: CreateUserDto = {
      email: 'janedoe@email.com',
      fullName: 'Jane Doe',
      username: 'janedoe',
      passwordHash: hash('sha512', 'helloworld'),
      isOwner: true,
      id: crypto.randomUUID(),
    };

    expect(await service.create(data)).toMatchObject(data);
    expect(repoMock.create).toHaveBeenCalledWith(data);
    expect(repoMock.save).toHaveBeenCalled();
  });

  // create()
  it('should throw validation error to the respective fields with errors when creating user', async () => {
    const data: CreateUserDto = {
      email: 'janedoe', // not in an email format
      fullName: 'Jane Doe', // valid
      username: 'J4ne_D0e', // uppercase letters not allowed

      passwordHash: hash('sha512', 'helloworld'),
      isOwner: true,
      id: crypto.randomUUID(),
    };

    try {
      await service.create(data);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
    }
  });

  //findAll()
  it('should findall', async () => {
    repoMock.find?.mockReturnValue([]);

    expect(await service.findAll()).toHaveLength(0);

    expect(repoMock.find).toHaveBeenCalled();
  });

  // findOne
  it('should find one', async () => {
    const dummy: Partial<User> = {
      id: crypto.randomUUID().toString(),
      fullName: 'Jane Doe',
    };
    repoMock.findOne?.mockReturnValue(dummy);

    expect(await service.findOne(dummy.id as string)).toEqual(dummy);
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: dummy.id } });
  });

  it('should return empty finding non-existing', async () => {
    const theid = crypto.randomUUID().toString();
    repoMock.findOne?.mockReturnValue(null);

    expect(await service.findOne(theid)).toBeNull();
    expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: theid } });
  });

  it('should request avatar update', async () => {
    const mockUrl = 'https://account.blob.core.windows.net/container/user/avatar/123.jpg?sv=...';

    storageMock.getUploadUrl?.mockResolvedValueOnce(mockUrl);
    repoMock.findOne?.mockReturnValue(user);

    const result = await service.requestUpdateAvatar({
      contentType: ContentTypes.JPEG,
      userId: user.id!,
    });

    expect(result).toBe(mockUrl);
    expect(storageMock.getUploadUrl).toHaveBeenCalledWith(
      expect.objectContaining({ 
        contentType: ContentTypes.JPEG,
        key: expect.stringMatching(/^user\/avatar\/.+\.jpg$/)
      }),
    );
  });

  it('throw limit error on frequent updating avatar', async () => {
    let existingUser = user;

    existingUser.lastUpdateAvatar = new Date(
      new Date().setDate(new Date().getDate() - 3),
    ); // sets back 3 days before the current time at runtime

    repoMock.findOne?.mockReturnValue(existingUser);
    configMock.get?.mockReturnValue(7); // assume config limit 7 days
    storageMock.getUploadUrl?.mockResolvedValue('test');

    expect.assertions(2);

    try {
      await service.requestUpdateAvatar({
        contentType: ContentTypes.JPEG,
        userId: existingUser.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserException);
      expect((error as UserException).code).toBe(
        UserExceptionCode.UPDATE_AVATAR_LIMIT,
      );
    }
  });
});
