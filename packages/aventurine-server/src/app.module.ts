import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [EngineModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
