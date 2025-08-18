import {
  IsDefined,
  isDefined,
  IsOptional,
  IsUrl,
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
