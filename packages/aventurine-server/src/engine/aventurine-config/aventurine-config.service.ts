import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigVariables } from './config-variables';
import { EnvironmentConfigDriver } from './drivers/environment-config.driver';
import { isEnvOnlyConfigVar } from './utils/is-env-only-config-var.util';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import {
  ConfigVariableException,
  ConfigVariableExceptionCode,
} from './aventurine-config.exception';
import { TypedReflect } from 'src/utils/typed-reflect';
import { ConfigVariablesMetadataOptions } from './decorators/config-variables-metadata';
import { ConfigSource } from './enums/config-source.enum';
import { CONFIG_VARIABLES_MASKING_CONFIG } from './constants/config-variables-masking-config';
import { ConfigVariablesMaskingStrategies } from './enums/config-variables-masking-strategies.enum';
import { configVariableMaskSensitiveData } from './utils/config-variable-mask-sensitive-data.util';
import { isString } from 'class-validator';
import { NodeEnvironment } from './enums/node-environment.enum';

@Injectable()
export class AventurineConfigService {
  private readonly logger = new Logger(AventurineConfigService.name);

  constructor(
    private readonly environmentConfigDriver: EnvironmentConfigDriver,
  ) {}

  get<T extends keyof ConfigVariables>(key: T): ConfigVariables[T] {
    if (isEnvOnlyConfigVar(key)) {
      return this.environmentConfigDriver.get(key);
    }
    return this.environmentConfigDriver.get(key);
  }

  getMetadata(
    key: keyof ConfigVariables,
  ): ConfigVariablesMetadataOptions | undefined {
    return this.getConfigMetadata()[key as string];
  }

  getAll(): Record<
    string,
    {
      value: ConfigVariables[keyof ConfigVariables];
      metadata: ConfigVariablesMetadataOptions;
      source: ConfigSource;
    }
  > {
    const result: Record<
      string,
      {
        value: ConfigVariables[keyof ConfigVariables];
        metadata: ConfigVariablesMetadataOptions;
        source: ConfigSource;
      }
    > = {};

    const metadata = this.getConfigMetadata();

    Object.entries(metadata).forEach(([key, envMetadata]) => {
      const typedKey = key as keyof ConfigVariables;
      let value = this.get(typedKey) ?? '';
      const source = this.determineConfigSource(typedKey, value, envMetadata);

      value = this.maskSensitiveValue(typedKey, value);

      result[key] = {
        value,
        metadata: envMetadata,
        source,
      };
    });

    return result;
  }

  getVariableWithMetadata(key: keyof ConfigVariables): {
    value: ConfigVariables[keyof ConfigVariables];
    metadata: ConfigVariablesMetadataOptions;
    source: ConfigSource;
  } | null {
    const metadata = this.getMetadata(key);

    if (!metadata) {
      return null;
    }

    let value = this.get(key) ?? '';
    const source = this.determineConfigSource(key, value, metadata);

    value = this.maskSensitiveValue(key, value);

    return {
      value,
      metadata,
      source,
    };
  }

  getLoggingConfig(): LoggerOptions {
    switch (this.get('NODE_ENV')) {
      case NodeEnvironment.DEVELOPMENT:
        return ['query', 'error'];
      case NodeEnvironment.TEST:
        return [];
      default:
        return ['error'];
    }
  }

  private determineConfigSource<T extends keyof ConfigVariables>(
    key: T,
    value: ConfigVariables[T],
    metadata: ConfigVariablesMetadataOptions,
  ): ConfigSource {
    const configVars = new ConfigVariables();

    if (metadata.isEnvOnly) {
      return value === configVars[key]
        ? ConfigSource.DEFAULT
        : ConfigSource.ENVIRONMENT;
    }

    return value === configVars[key]
      ? ConfigSource.DEFAULT
      : ConfigSource.ENVIRONMENT;
  }

  private maskSensitiveValue<T extends keyof ConfigVariables>(
    key: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    if (!isString(value) || !(key in CONFIG_VARIABLES_MASKING_CONFIG)) {
      return value;
    }

    const varMaskingConfig =
      CONFIG_VARIABLES_MASKING_CONFIG[
        key as keyof typeof CONFIG_VARIABLES_MASKING_CONFIG
      ];
    const options =
      varMaskingConfig.strategy ===
      ConfigVariablesMaskingStrategies.LAST_N_CHARS
        ? { chars: varMaskingConfig.chars }
        : undefined;

    return configVariableMaskSensitiveData(value, varMaskingConfig.strategy, {
      ...options,
      variableName: key as string,
    });
  }

  private getConfigMetadata(): Record<string, ConfigVariablesMetadataOptions> {
    return TypedReflect.getMetadata('config-variables', ConfigVariables) ?? {};
  }
  validateConfigVariableExists(key: string): boolean {
    const metadata = this.getConfigMetadata();
    const keyExists = key in metadata;

    if (!keyExists) {
      throw new ConfigVariableException(
        `Config variable "${key}" does not exist in ConfigVariables`,
        ConfigVariableExceptionCode.VARIABLE_NOT_FOUND,
      );
    }

    return true;
  }
}
