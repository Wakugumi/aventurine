import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CaslModule } from './engine/casl/casl.module';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CaslModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
