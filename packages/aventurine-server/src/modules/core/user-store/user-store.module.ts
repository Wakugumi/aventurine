import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStore } from './user-store.entity';
import { UserStoreService } from './user-store.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserStore])],
  providers: [UserStoreService],
  exports: [TypeOrmModule],
})
export class UserStoreModule {}
