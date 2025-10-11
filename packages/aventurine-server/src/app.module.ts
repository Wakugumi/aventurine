import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EngineModule } from './engine/engine.module';
import { CoreModule } from './modules/core/core.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [EngineModule, AuthModule, CoreModule, DatabaseModule],
  providers: [AppService],
})
export class AppModule { }
