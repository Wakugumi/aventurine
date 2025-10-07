# Aventurine Engine Modules

This directory contains the core engine modules for the Aventurine platform, including telemetry, logging, and observability systems.

## Modules Overview

### 1. Telemetry Module (`/telemetry/`)
A comprehensive telemetry system for tracking application metrics, performance, and events.

**Key Features:**
- Event tracking with timing and metadata
- Performance monitoring
- Configurable sampling and filtering
- Multiple output formats (console, file, external)
- Decorator-based automatic tracking
- Context management for request tracing

**Usage:**
```typescript
import { TelemetryModule } from './engine/telemetry/telemetry.module';

@Module({
  imports: [
    TelemetryModule.register({
      enabled: true,
      environment: 'development',
      output: { console: true }
    })
  ]
})
export class AppModule {}
```

### 2. Logger Module (`/logger/`)
A dynamic, extensible logging system with support for multiple drivers and runtime configuration.

**Key Features:**
- Multiple drivers (console, file, external, custom)
- Dynamic configuration via AventurineConfig
- Structured logging (JSON/text/pretty)
- Performance tracking and metrics
- Context management
- Batch processing for external services

**Usage:**
```typescript
import { LoggerModule } from './engine/logger/logger.module';

@Module({
  imports: [
    LoggerModule.register({
      level: 'info',
      drivers: [
        {
          name: 'console',
          type: 'console',
          enabled: true,
          options: {}
        }
      ]
    })
  ]
})
export class AppModule {}
```

### 3. Observability Module (`/observability/`)
A combined module that integrates both telemetry and logging for comprehensive observability.

**Usage:**
```typescript
import { ObservabilityModule } from './engine/observability/observability.module';

@Module({
  imports: [
    ObservabilityModule.register({
      telemetry: { /* telemetry config */ },
      logger: { /* logger config */ }
    })
  ]
})
export class AppModule {}
```

## Configuration Integration

Both modules integrate with the AventurineConfig system for dynamic configuration:

### Telemetry Configuration Variables
- `telemetry.enabled` - Enable/disable telemetry
- `telemetry.environment` - Environment (development/staging/production)
- `telemetry.sampling.rate` - Sampling rate (0-1)
- `telemetry.output.console` - Enable console output
- `telemetry.output.file.enabled` - Enable file output
- `telemetry.output.external.enabled` - Enable external service
- And more...

### Logger Configuration Variables
- `logger.level` - Default log level
- `logger.environment` - Environment
- `logger.drivers.console.enabled` - Enable console driver
- `logger.drivers.file.enabled` - Enable file driver
- `logger.drivers.external.enabled` - Enable external driver
- And more...

## Quick Start Guide

### 1. Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { AventurineConfigModule } from './engine/aventurine-config/aventurine-config.module';
import { ObservabilityModule } from './engine/observability/observability.module';
import { AventurineConfigService } from './engine/aventurine-config/aventurine-config.service';
import { createTelemetryOptionsFromConfig } from './engine/telemetry/config/telemetry.config';
import { createLoggerOptionsFromConfig } from './engine/logger/config/logger.config';

@Module({
  imports: [
    AventurineConfigModule.register({
      // Your config setup
    }),
    ObservabilityModule.registerAsync({
      telemetryFactory: (configService: AventurineConfigService) => {
        const config = configService.getAll();
        return createTelemetryOptionsFromConfig(config);
      },
      loggerFactory: (configService: AventurineConfigService) => {
        const config = configService.getAll();
        return createLoggerOptionsFromConfig(config);
      },
      inject: [AventurineConfigService],
    }),
  ],
})
export class AppModule {}
```

### 2. Using in Services

```typescript
import { Injectable } from '@nestjs/common';
import { TelemetryService } from './engine/telemetry/services/telemetry.service';
import { LoggerService } from './engine/logger/services/logger.service';
import { TrackOperation } from './engine/telemetry/decorators';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    private telemetry: TelemetryService,
    logger: LoggerService
  ) {
    this.logger = logger.forModule('UserService');
  }

  @TrackOperation({
    module: 'UserService',
    operation: 'createUser',
    trackTiming: true
  })
  async createUser(userData: any) {
    this.logger.info('Creating user', { email: userData.email });
    
    try {
      const user = await this.performUserCreation(userData);
      this.logger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error as Error);
      throw error;
    }
  }

  private async performUserCreation(userData: any) {
    // Your business logic
    return { id: '123', email: userData.email };
  }
}
```

## Development vs Production

### Development
- Console output enabled by default
- Detailed logging and telemetry
- No sampling (all events tracked)
- File output optional

### Production
- External service integration
- Sampling enabled to control data volume
- File output for persistence
- Performance optimizations

## Best Practices

1. **Start Simple**: Begin with console output in development
2. **Use Decorators**: Prefer decorators for consistent tracking
3. **Set Context**: Always set request context for traceability
4. **Structured Data**: Use structured logging instead of string concatenation
5. **Sample in Production**: Use sampling to control data volume
6. **Monitor Performance**: Use timing tracking to identify bottlenecks
7. **Security**: Be careful not to log sensitive information

## File Structure

```
engine/
├── telemetry/
│   ├── services/
│   ├── decorators/
│   ├── config/
│   ├── types/
│   ├── utils/
│   └── examples/
├── logger/
│   ├── services/
│   ├── drivers/
│   ├── factories/
│   ├── config/
│   ├── types/
│   ├── utils/
│   └── examples/
├── observability/
│   ├── types/
│   └── observability.module.ts
└── examples/
    └── combined-usage.example.ts
```

## Examples

See the `examples/` directories in each module for comprehensive usage examples:
- `/telemetry/examples/usage.example.ts` - Telemetry usage examples
- `/logger/examples/usage.example.ts` - Logger usage examples
- `/examples/combined-usage.example.ts` - Combined telemetry and logging examples

## Integration with Other Modules

These engine modules work seamlessly with:
- **AventurineConfig**: For dynamic configuration
- **Storage Module**: For persistent data storage
- **Auth Module**: For user context in logs and telemetry
- **API Modules**: For request/response tracking

## Next Steps

1. Configure the modules in your `AppModule`
2. Add telemetry and logging to your services
3. Set up external services for production
4. Monitor and analyze the collected data
5. Optimize based on performance metrics
