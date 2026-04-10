import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { AuthGuard } from "src/engine/auth/guards/auth.guard";
import { FetchPricesQuery } from "./queries/fetch-prices.query";
import { CurrencyCode } from "./types/currency.enum";
import { GetPriceQuery } from "./queries/get-price.query";
import { createZodDto } from "nestjs-zod";

import { CommonPriceResponse, FetchPricesResponse, UpdatePriceRequest } from '@aventurine/shared'
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { User } from "../user/user.entity";
import { CreatePriceDto } from "./dtos/create-price.dto";
import { CreatePriceCommand } from "./commands/create-price.command";
import { UpdatePriceDto } from "./dtos/update-price.dto";
import { UpdatePriceCommand } from "./commands/update-price.command";
import { DeepPartial } from "typeorm";
import { Price } from "./price.entity";
import { DeletePriceCommand } from "./commands/delete-price.command";

@Controller("price")
@UseGuards(AuthGuard)
export class PriceController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {

  }


  @Post()
  @ApiBody({ type: CreatePriceDto })
  async create(@Body() payload: CreatePriceDto, @CurrentUser() user: User) {
    return await this.commandBus.execute<CreatePriceCommand>(
      new CreatePriceCommand(payload.productId, user.id, payload.label, payload.currencyCode as CurrencyCode, payload.unitAmount, undefined, payload.displayLabel)
    )

  }


  @Get('product/:productId')
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: "string" })
  @ApiQuery({ name: 'label', type: 'string', required: false })
  @ApiQuery({ name: 'displayName', type: 'string', required: false })
  @ApiQuery({ name: 'currency', type: "enum", enum: CurrencyCode, required: false })
  async fetch(@Param('productId') productId: string, @Query('label') label?: string, @Query('displayName') displayName?: string, @Query('currency') currency?: CurrencyCode) {
    return await this.queryBus.execute<FetchPricesQuery>(
      new FetchPricesQuery(productId, label, displayName, currency)
    )
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: CommonPriceResponse })
  async get(@Param('id') id: string) {
    return await this.queryBus.execute<GetPriceQuery>(
      new GetPriceQuery(id)
    )
  }
  @Patch(':id')
  async update(@CurrentUser() user: User, @Param('id') priceId: string, @Body() payload: UpdatePriceDto) {
    return await this.commandBus.execute<UpdatePriceCommand>(
      new UpdatePriceCommand(priceId, user.id, payload as DeepPartial<Price>)
    )
  }

  @Delete(':id')
  async delete(@CurrentUser() user: User, @Param('id') priceId: string) {
    return await this.commandBus.execute<DeletePriceCommand>(
      new DeletePriceCommand(priceId, user.id)
    )
  }

}
