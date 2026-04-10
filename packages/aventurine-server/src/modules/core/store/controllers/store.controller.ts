import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetStoreResponse } from "@aventurine/shared"
import { GetStoreQuery } from '../queries/get-store.query';
import { AuthGuard } from 'src/engine/auth/guards/auth.guard';
import { CheckPermissions } from 'src/engine/access-control/decorators/check-permission.decorator';
import { Action, Subject } from 'src/engine/access-control/enums/permissions.enum';
import { CreateStoreDto } from '../dtos/create-store.dto';
import { CreateStoreCommand } from '../commands/create-store.command';
import { UpdateStoreDto } from '../dtos/update-store.dto';
import { CurrentUser } from 'src/engine/auth/decorators/current-user.decorator';
import { User } from '../../user/user.entity';
import { UpdateStoreCommand } from '../commands/update-store.command';
import { FetchStoresQuery } from '../queries/fetch-stores.query';

@Controller('store')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) { }


  @Get('get/:id')
  @ApiResponse({ type: GetStoreResponse })
  @ApiBearerAuth()
  @CheckPermissions(Action.READ, Subject.STORE)
  async get(@Param('id') storeId: string) {
    return await this.queryBus.execute<GetStoreQuery>(
      new GetStoreQuery(storeId)
    )
  }


  @Post('create')
  @ApiResponse({ type: CreateStoreDto })
  @ApiBearerAuth()
  @ApiBody({ type: CreateStoreDto })
  @CheckPermissions(Action.CREATE, Subject.STORE)
  async create(@CurrentUser() user: User, @Body() payload: CreateStoreDto) {
    return this.commandBus.execute<CreateStoreCommand>(
      new CreateStoreCommand(user.id, payload.label)
    )
  }

  @Put('update')
  @ApiResponse({ type: UpdateStoreDto })
  @ApiBearerAuth()
  @CheckPermissions(Action.UPDATE, Subject.STORE)
  async update(@CurrentUser() user: User, @Body() payload: UpdateStoreDto) {
    return await this.commandBus.execute<UpdateStoreCommand>(
      new UpdateStoreCommand(payload.storeId, user.id, payload)
    )
  }


  @Get("list")
  @ApiBearerAuth()
  @CheckPermissions(Action.READ, Subject.STORE)
  @ApiQuery({ name: 'label', required: false })
  @ApiQuery({ name: 'displayName', required: false })
  async list(@CurrentUser() user: User, @Query('label') label: string, @Query('displayName') name: string) {
    return await this.queryBus.execute<FetchStoresQuery>(
      new FetchStoresQuery(user.id, label || name ? { label: label, displayName: name } : undefined)
    )
  }

}
