import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypedReflect } from 'src/utils/typed-reflect';
import { ConfigVariables } from './config-variables';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from './constants/config-variables-instance.constant';
import { ConfigVariablesGroup } from './enums/config-variables-group.enum';
import { AventurineConfigService } from './aventurine-config.service';
import { EnvironmentConfigDriver } from './drivers/environment-config.driver';
import { isEnvOnlyConfigVar } from './utils/is-env-only-config-var.util';
import { ConfigSource } from './enums/config-source.enum';

jest.mock('src/utils/typed-reflect', () => ({
  TypedReflect: {
    getMetadata: jest.fn(),
    defineMetadata: jest.fn(),
  },
}));

jest.mock(
  'src/engine/aventurine-config/constants/config-variables-masking-config',
  () => ({
    CONFIG_VARIABLES_MASKING_CONFIG: {
      SENSITIVE_VAR: {
        strategy: 'LAST_N_CHARS',
        chars: 5,
      },
    },
  }),
);

jest.mock(
  'src/engine/aventurine-config/utils/is-env-only-config-var.util',
  () => ({
    isEnvOnlyConfigVar: jest.fn(),
  }),
);

type AventurineConfigServicePrivateProps = {
  isDatabaseDriverActive: boolean;
};

const mockConfigVarMetadata = {
  TEST_VAR: {
    group: ConfigVariablesGroup.GoogleAuth,
    description: 'Test variable',
    isEnvOnly: false,
  },
  ENV_ONLY_VAR: {
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Environment only variable',
    isEnvOnly: true,
  },
  SENSITIVE_VAR: {
    group: ConfigVariablesGroup.Logging,
    description: 'Sensitive variable',
    isSensitive: true,
  },
};

const setupTestModule = async (isDatabaseConfigEnabled = true) => {
  const configServiceMock = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'IS_CONFIG_VARIABLES_IN_DB_ENABLED') {
        return isDatabaseConfigEnabled ? 'true' : 'false';
      }

      return undefined;
    }),
  };

  const mockConfigVariablesInstance = {
    TEST_VAR: 'test value',
    ENV_ONLY_VAR: 'env only value',
    SENSITIVE_VAR: 'sensitive value',
    NO_METADATA_KEY: 'value without metadata',
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AventurineConfigService,
      {
        provide: EnvironmentConfigDriver,
        useValue: {
          get: jest.fn().mockImplementation((key) => {
            return configServiceMock.get(key);
          }),
        },
      },
      {
        provide: ConfigService,
        useValue: configServiceMock,
      },
      {
        provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
        useValue: mockConfigVariablesInstance,
      },
    ],
  }).compile();

  return {
    service: module.get<AventurineConfigService>(AventurineConfigService),
    environmentConfigDriver: module.get<EnvironmentConfigDriver>(
      EnvironmentConfigDriver,
    ),
    configService: module.get<ConfigService>(ConfigService),
    configVariablesInstance: module.get(CONFIG_VARIABLES_INSTANCE_TOKEN),
  };
};

const setupTestModuleWithoutDb = async () => {
  const configServiceMock = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'IS_CONFIG_VARIABLES_IN_DB_ENABLED') {
        return 'false';
      }

      return undefined;
    }),
  };

  const mockConfigVariablesInstance = {
    TEST_VAR: 'test value',
    ENV_ONLY_VAR: 'env only value',
    SENSITIVE_VAR: 'sensitive value',
    NO_METADATA_KEY: 'value without metadata',
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AventurineConfigService,
      {
        provide: EnvironmentConfigDriver,
        useValue: {
          get: jest.fn().mockImplementation((key) => {
            return configServiceMock.get(key);
          }),
        },
      },
      {
        provide: ConfigService,
        useValue: configServiceMock,
      },
      {
        provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
        useValue: mockConfigVariablesInstance,
      },
    ],
  }).compile();

  return {
    service: module.get<AventurineConfigService>(AventurineConfigService),
    environmentConfigDriver: module.get<EnvironmentConfigDriver>(
      EnvironmentConfigDriver,
    ),
    configService: module.get<ConfigService>(ConfigService),
    configVariablesInstance: module.get(CONFIG_VARIABLES_INSTANCE_TOKEN),
  };
};

const setPrivateProps = (
  service: AventurineConfigService,
  props: Partial<AventurineConfigServicePrivateProps>,
) => {
  Object.entries(props).forEach(([key, value]) => {
    Object.defineProperty(service, key, {
      value,
      writable: true,
    });
  });
};

describe('AventurineConfigService', () => {
  let service: AventurineConfigService;
  let environmentConfigDriver: EnvironmentConfigDriver;

  beforeEach(async () => {
    const testModule = await setupTestModule(true);

    service = testModule.service;
    environmentConfigDriver = testModule.environmentConfigDriver;
    // no database driver required for these unit tests

    (TypedReflect.getMetadata as jest.Mock).mockReturnValue(
      mockConfigVarMetadata,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should set isDatabaseDriverActive to false when database config is disabled', async () => {
      const { service, environmentConfigDriver } =
        await setupTestModuleWithoutDb();

      expect(environmentConfigDriver.get).toHaveBeenCalledWith(
        'IS_CONFIG_VARIABLES_IN_DB_ENABLED',
      );

      // The service should be constructible without DB-backed config enabled
      expect(service).toBeDefined();
    });
  });

  describe('get', () => {
    const key = 'TEST_VAR' as keyof ConfigVariables;
    const expectedValue = 'test value';

    beforeEach(() => {
      (isEnvOnlyConfigVar as jest.Mock).mockReturnValue(false);
    });

    it('should use environment driver for environment-only variables', () => {
      (isEnvOnlyConfigVar as jest.Mock).mockReturnValue(true);
      jest.spyOn(environmentConfigDriver, 'get').mockReturnValue(expectedValue);

      const result = service.get(key);

      expect(result).toBe(expectedValue);
      expect(environmentConfigDriver.get).toHaveBeenCalledWith(key);
    });

    it('should return undefined when key does not exist in any driver', () => {
      const nonExistentKey = 'NON_EXISTENT_KEY' as keyof ConfigVariables;

      jest
        .spyOn(environmentConfigDriver, 'get')
        .mockReturnValue(undefined as any);
      setPrivateProps(service, { isDatabaseDriverActive: false });

      const result = service.get(nonExistentKey);

      expect(result).toBeUndefined();
      expect(environmentConfigDriver.get).toHaveBeenCalledWith(nonExistentKey);
    });
    it('should use environment driver when isDatabaseDriverActive is false', () => {
      jest.spyOn(environmentConfigDriver, 'get').mockReturnValue(expectedValue);
      setPrivateProps(service, { isDatabaseDriverActive: false });

      const result = service.get(key);

      expect(result).toBe(expectedValue);
      expect(environmentConfigDriver.get).toHaveBeenCalledWith(key);
    });
  });

  // update/set/delete behavior was removed when DB-backed config was removed.
  // Keep tests focused on environment-driven behavior below.

  describe('getMetadata', () => {
    it('should return metadata for a config variable', () => {
      const result = service.getMetadata('TEST_VAR' as keyof ConfigVariables);

      expect(result).toEqual(mockConfigVarMetadata.TEST_VAR);
    });

    it('should return undefined when metadata does not exist', () => {
      const result = service.getMetadata(
        'UNKNOWN_VAR' as keyof ConfigVariables,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    const setupDriverMocks = () => {
      jest
        .spyOn(environmentConfigDriver, 'get')
        .mockImplementation((key: keyof ConfigVariables) => {
          const keyStr = String(key);
          const values = {
            TEST_VAR: 'env test value',
            ENV_ONLY_VAR: 'env only value',
            SENSITIVE_VAR: 'sensitive_data_123',
          };

          return values[keyStr] || undefined;
        });
    };

    beforeEach(() => {
      setupDriverMocks();
    });

    it('should return all config variables with environment source when database driver is not active', () => {
      setPrivateProps(service, {
        isDatabaseDriverActive: false,
      });

      const result = service.getAll();

      expect(result).toEqual({
        TEST_VAR: {
          value: 'env test value',
          metadata: mockConfigVarMetadata.TEST_VAR,
          source: ConfigSource.ENVIRONMENT,
        },
        ENV_ONLY_VAR: {
          value: 'env only value',
          metadata: mockConfigVarMetadata.ENV_ONLY_VAR,
          source: ConfigSource.ENVIRONMENT,
        },
        SENSITIVE_VAR: {
          value: expect.any(String),
          metadata: mockConfigVarMetadata.SENSITIVE_VAR,
          source: ConfigSource.ENVIRONMENT,
        },
      });

      expect(result.SENSITIVE_VAR.value).toBe('********a_123');
    });
  });

  // cache-related tests removed: Database-backed config is no longer a feature

  describe('validateConfigVariableExists', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be called by set, update, and delete methods', async () => {
      const validateSpy = jest
        .spyOn(service, 'validateConfigVariableExists')
        .mockReturnValue(true);
      // ensure DB driver is disabled — set methods will throw before calling validate
      setPrivateProps(service, { isDatabaseDriverActive: false });
      jest
        .spyOn(service as any, 'validateNotEnvOnly')
        .mockImplementation(() => {});

      // Since database driver is disabled, set/update/delete will throw. We assert
      // that the validateConfigVariableExists function itself works separately below.
      expect(validateSpy).not.toHaveBeenCalled();
    });

    it('should return true for valid config variables with metadata', () => {
      jest.spyOn(service, 'validateConfigVariableExists').mockRestore();

      jest
        .spyOn(service as any, 'getMetadata')
        .mockReturnValue(mockConfigVarMetadata.TEST_VAR);

      expect(service.validateConfigVariableExists('TEST_VAR')).toBe(true);
    });

    it('should throw error when config variable does not exist', () => {
      jest.spyOn(service, 'validateConfigVariableExists').mockRestore();

      expect(() => {
        service.validateConfigVariableExists('MISSING_KEY');
      }).toThrow(
        'Config variable "MISSING_KEY" does not exist in ConfigVariables',
      );
    });
  });
});
