import { Module } from '@nestjs/common';
import { EngineModule } from 'src/engine/engine.module';

@Module({
  imports: [EngineModule],
})
export class FileModule {}
