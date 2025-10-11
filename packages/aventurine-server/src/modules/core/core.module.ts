import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [StoreModule, UserModule],

})
export class CoreModule { }
