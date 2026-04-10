import { forwardRef, Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { CreateStoreHandler } from './commands/handlers/create-store.handler';
import { UpdateStoreHandler } from './commands/handlers/update-store.handler';
import { FetchStoresHandler } from './queries/handlers/fetch-stores.handler';
import { AuthModule } from 'src/engine/auth/auth.module';
import { ACLModule } from 'src/engine/access-control/acl.module';
import { GetStoreQueryHandler } from './queries/handlers/get-store-query.handler';
import { MenuModule } from 'src/modules/menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), AuthModule, ACLModule, forwardRef(() => MenuModule)],
  controllers: [StoreController],
  providers: [StoreService, CreateStoreHandler, UpdateStoreHandler, FetchStoresHandler, GetStoreQueryHandler],
})
export class StoreModule { }
