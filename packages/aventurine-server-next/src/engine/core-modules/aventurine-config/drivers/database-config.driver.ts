import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';
import { DatabaseConfigDriverInterface } from './interfaces/database-config-driver.interface';
import { ConfigVariables } from '../config-variables';
import { ConfigCacheService } from '../cache/config-cache.service';
import { isEnvOnlyConfigVar } from '../utils/is-env-only-config-var.util';
import { CONFIG_VARIABLES_REFRESH_CRON_INTERVAL } from '../constants/config-variables-refresh-cron-interval.constants';

@Injectable()
export class DatabaseConfigDriver
  implements DatabaseConfigDriverInterface, OnModuleInit
{
  private readonly logger = new Logger(DatabaseConfigDriver.name);
  private readonly configKeys: Array<keyof ConfigVariables>;

  constructor(
    private readonly configCache: ConfigCacheService,
    private readonly configStorage: any,
  ) {
    const allKeys = Object.keys(new ConfigVariables()) as Array<
      keyof ConfigVariables
    >;

    this.configKeys = allKeys.filter((key) => !isEnvOnlyConfigVar(key));

    this.logger.debug(
      '[INIT] Database config driver initialized with keys: ' +
        this.configKeys.length,
    );
  }

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log('[INIT] Loading config variables from database');
      const loadedCount = await this.loadAllConfigVarsFromDb();

      this.logger.log(
        `[INIT] Loaded ${loadedCount} values from DB, ${this.configKeys.length - loadedCount} falling to env vars/defaults`,
      );
    } catch (error) {
      this.logger.error(
        `[INIT] Failed to load config vars from DB, falling back to env vars`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  get<T extends keyof ConfigVariables>(key: T): ConfigVariables[T] | undefined {
    return this.configCache.get(key);
  }

  async set<T extends keyof ConfigVariables>(
    key: T,
    value: ConfigVariables[T],
  ): Promise<void> {
    if (isEnvOnlyConfigVar(key)) {
      throw new Error(`Cannot set environment-only variable: ${key as string}`);
    }

    await this.configStorage.set(key, value);
    this.configCache.set(key, value);
  }

  async update<T extends keyof ConfigVariables>(
    key: T,
    value: ConfigVariables[T],
  ): Promise<void> {
    if (isEnvOnlyConfigVar(key)) {
      throw new Error(
        `Cannot update environment-only variable: ${key as string}`,
      );
    }

    await this.configStorage.set(key, value);
    this.configCache.set(key, value);
  }

  async delete(key: keyof ConfigVariables): Promise<void> {
    if (isEnvOnlyConfigVar(key)) {
      throw new Error(
        `Cannot delete environment-only variable: ${key as string}`,
      );
    }
    await this.configStorage.delete(key);
    this.configCache.markKeyAsMissing(key);
  }

  getCacheInfo(): {
    foundConfigValues: number;
    knownMissingKeys: number;
    cacheKeys: string[];
  } {
    return this.configCache.getCacheInfo();
  }

  private async loadAllConfigVarsFromDb(): Promise<number> {
    const configVars = await this.configStorage.loadAll();

    for (const [key, value] of configVars.entries()) {
      this.configCache.set(key, value);
    }

    for (const key of this.configKeys) {
      if (!configVars.has(key)) {
        this.configCache.markKeyAsMissing(key);
      }
    }

    return configVars.size;
  }

  @Cron(CONFIG_VARIABLES_REFRESH_CRON_INTERVAL)
  async refreshAllCache(): Promise<void> {
    try {
      const dbValues = await this.configStorage.loadAll();

      for (const [key, value] of dbValues.entries()) {
        if (!isEnvOnlyConfigVar(key)) this.configCache.set(key, value);
      }

      for (const key of this.configKeys) {
        if (!dbValues.has(key)) {
          this.configCache.markKeyAsMissing(key);
        }
      }
    } catch (error) {
      this.logger.error(
        'Failed to refresh config variables from database',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
