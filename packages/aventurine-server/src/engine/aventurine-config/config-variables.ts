import {
  IsDefined,
  isDefined,
  IsOptional,
  IsUrl,
  ValidateIf,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ConfigVariablesMetadata } from './decorators/config-variables-metadata';
import { ConfigVariableType } from './enums/config-variable-type.enum';
import { ConfigVariablesGroup } from './enums/config-variables-group.enum';
import { CastToUpperSnakeCase } from './decorators/cast-to-upper-snake-case.decorator';
import { CastToLogLevelArray } from './decorators/cast-to-log-level-array.decorator';
import { Logger, LogLevel } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CastToPositiveNumber } from './decorators/cast-to-positive-number.decorator';
import { NodeEnvironment } from './enums/node-environment.enum';
import { StorageDriverOptions } from '../storage/types/storage.types';
import { LoggerDriverType } from '../logger/interfaces/logger.interface';

export class ConfigVariables {
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'Enable or disable password authentication',
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  AUTH_PASSWORD_ENABLED = true;

  // Logging
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Logging,
    description: 'Levels of logging to be captured',
    type: ConfigVariableType.ARRAY,
    options: ['log', 'error', 'warn', 'debug'],
    isEnvOnly: true,
  })
  @CastToLogLevelArray()
  @IsOptional()
  LOG_LEVELS: LogLevel[] = ['log', 'error', 'warn'];

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Logging,
    description: 'Driver used for logging',
    type: ConfigVariableType.ENUM,
    options: Object.values(LoggerDriverType),
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  LOGGER_DRIVER: LoggerDriverType = LoggerDriverType.CONSOLE;

  // Server Config

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    isSensitive: true,
    description: 'Database connection URL',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsDefined()
  @IsUrl({
    protocols: ['postgres', 'postgresql'],
    require_tld: false,
    allow_underscores: true,
    require_host: false,
  })
  DATABASE_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description:
      'Allow connections to a database with self-signed certificates',
    isEnvOnly: true,
    type: ConfigVariableType.BOOLEAN,
  })
  @IsOptional()
  DATABASE_SSL_ALLOW_SELF_SIGNED = false;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Url for the frontend application',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  FRONTEND_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Enable config from database',
    type: ConfigVariableType.BOOLEAN,
    isEnvOnly: true,
  })
  IS_CONFIG_VARIABLES_IN_DB_ENABLED: boolean;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    isSensitive: true,
    description: 'URL for cache storage (e.g., Redis connection URL)',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_tld: false,
    allow_underscores: true,
  })
  REDIS_URL: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Node environment (development, production, etc.)',
    type: ConfigVariableType.ENUM,
    options: Object.values(NodeEnvironment),
    isEnvOnly: true,
  })
  // @CastToUpperSnakeCase()
  NODE_ENV: NodeEnvironment = NodeEnvironment.PRODUCTION;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Port for the node server',
    type: ConfigVariableType.NUMBER,
    isEnvOnly: true,
  })
  @CastToPositiveNumber()
  @IsOptional()
  NODE_PORT = 3000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    description: 'Base URL for the server',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsUrl({ require_tld: false, require_protocol: true })
  @IsOptional()
  SERVER_URL = 'http://localhost:3000';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.ServerConfig,
    isSensitive: true,
    description: 'Secret key for the application',
    isEnvOnly: true,
    type: ConfigVariableType.STRING,
  })
  APP_SECRET: string;

  // Cache Config

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TokensDuration,
    description: 'Time-to-live for cache storage in seconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  CACHE_STORAGE_TTL: number = 3600 * 24 * 7;

  // Storage Config

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.TokensDuration,
    description: 'Expiration duration of Signed URL in seconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  SAS_TTL: number = 60 * 60; // an hour

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Range limit of days user can update avatar again',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  UPDATE_AVATAR_LIMIT: number = 7;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Type of storage to use',
    type: ConfigVariableType.ENUM,
    options: Object.values(StorageDriverOptions),
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  STORAGE_TYPE: StorageDriverOptions = StorageDriverOptions.LOCAL;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Local storage path',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverOptions.LOCAL)
  STORAGE_LOCAL_PATH: string = '.local-storage';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Azure account name string',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverOptions.AZURE)
  STORAGE_AZURE_ACCOUNT_NAME: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Azure account key string',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverOptions.AZURE)
  STORAGE_AZURE_ACCOUNT_KEY: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Azure container name',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverOptions.AZURE)
  STORAGE_AZURE_CONTAINER_NAME: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Azure connection string',
    type: ConfigVariableType.STRING,
  })
  @ValidateIf((env) => env.STORAGE_TYPE === StorageDriverOptions.AZURE)
  STORAGE_AZURE_CONNECTION_STRING: string;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.StorageConfig,
    description: 'Public base URL for stored files (used for building public file URLs)',
    type: ConfigVariableType.STRING,
    isEnvOnly: true,
  })
  @IsOptional()
  STORAGE_PUBLIC_BASE_URL: string;

  // CQRS Configuration
  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'CQRS driver type',
    type: ConfigVariableType.ENUM,
    options: ['NESTJS', 'CUSTOM'],
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  CQRS_DRIVER_TYPE: string = 'NESTJS';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'CQRS transport type',
    type: ConfigVariableType.ENUM,
    options: ['IN_MEMORY', 'REDIS', 'KAFKA'],
    isEnvOnly: true,
  })
  @IsOptional()
  @CastToUpperSnakeCase()
  CQRS_TRANSPORT_TYPE: string = 'IN_MEMORY';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'Redis key prefix for CQRS',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CQRS_REDIS_KEY_PREFIX: string = 'cqrs:';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'Kafka brokers for CQRS (comma-separated)',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CQRS_KAFKA_BROKERS: string = 'localhost:9092';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'Kafka client ID for CQRS',
    type: ConfigVariableType.STRING,
  })
  @IsOptional()
  CQRS_KAFKA_CLIENT_ID: string = 'aventurine-cqrs';

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'Command execution timeout in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  CQRS_COMMAND_TIMEOUT: number = 30000;

  @ConfigVariablesMetadata({
    group: ConfigVariablesGroup.Other,
    description: 'Query execution timeout in milliseconds',
    type: ConfigVariableType.NUMBER,
  })
  @CastToPositiveNumber()
  @IsOptional()
  CQRS_QUERY_TIMEOUT: number = 15000;
}

export const validate = (config: Record<string, unknown>): ConfigVariables => {
  const validatedConfig = plainToClass(ConfigVariables, config);

  const validationErrors = validateSync(validatedConfig, {
    strictGroups: true,
  });

  const validationWarnings = validateSync(validatedConfig, {
    groups: ['warning'],
  });
  const logValidatonErrors = (
    errorCollection: ValidationError[],
    type: 'error' | 'warn',
  ) =>
    errorCollection.forEach((error) => {
      if (!isDefined(error.constraints) || !isDefined(error.property)) {
        return;
      }
      Logger[type](Object.values(error.constraints).join('\n'));
    });

  if (validationWarnings.length > 0) {
    logValidatonErrors(validationWarnings, 'warn');
  }
  return validatedConfig;
};
