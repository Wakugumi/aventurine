import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurableModuleClass } from './aventurine-config.module-definition';
import { ConfigVariables, validate } from './config-variables';
import { AventurineConfigService } from './aventurine-config.service';
import { EnvironmentConfigDriver } from './drivers/environment-config.driver';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from './constants/config-variables-instance.constant';

@Global()
@Module({})
export class AventurineConfigModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    const imports: Array<DynamicModule | Promise<DynamicModule>> = [
      ConfigModule.forRoot({
        isGlobal: true,
        expandVariables: true,
        validate: validate,
        envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      }),
    ];

    return {
      module: AventurineConfigModule,
      imports,
      providers: [
        AventurineConfigService,
        EnvironmentConfigDriver,
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
      exports: [AventurineConfigService],
    };
  }
}

