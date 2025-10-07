import { AventurineConfigService } from '../aventurine-config/aventurine-config.service';
import {
  LoggerDriverType,
  LoggerModuleOptions,
} from './interfaces/logger.interface';

export const loggerModuleFactory = async (
  configService: AventurineConfigService,
): Promise<LoggerModuleOptions> => {
  const driverType = configService.get('LOGGER_DRIVER');
  const logLevels = configService.get('LOG_LEVELS');

  switch (driverType) {
    case LoggerDriverType.CONSOLE:
      return {
        type: LoggerDriverType.CONSOLE,
        logLevels: logLevels,
      };

    default:
      throw new Error(
        `Invalid logger type ${driverType}, please check your environment config (Logger config is environment only, check .env file)`,
      );
  }
};
