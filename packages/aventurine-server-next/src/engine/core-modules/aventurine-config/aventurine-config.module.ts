import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurableModuleClass } from './aventurine-config.module-definition';
import { validate } from './config-variables';

export class AventurineConfigModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    const imports = [
      ConfigModule.forRoot({
        isGlobal: true,
        expandVariables: true,
        validate: validate,
        envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      }),
    ];
  }
}
