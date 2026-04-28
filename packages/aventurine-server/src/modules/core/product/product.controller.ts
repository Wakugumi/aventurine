import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { User } from "../user/user.entity";
import { FetchProductsQuery } from "./queries/fetch-products.query";
import { Pagination } from "src/engine/decorators/pagination.decorator";
import { PaginateOptions } from "src/utils/paginate.util";
import { GetProductQuery } from "./queries/get-product.query";
import { AuthGuard } from "src/engine/auth/guards/auth.guard";
import { PermissionsGuard } from "src/engine/guards/permissions.guard";
import { Subject, Action } from "src/engine/access-control/enums/permissions.enum";
import { CheckPermissions } from "src/engine/access-control/decorators/check-permission.decorator";
import { ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";
import { DraftProductCommand } from "./commands/draft-product.command";
import { UpdateProductCommand } from "./commands/update-product.command";
import { UpdateProductDto } from "./dtos/update-product.dto";
import { SubmitProductCommand } from "./commands/submit-product.command";

@Controller('product')
@UseGuards(AuthGuard, PermissionsGuard)
export class ProductController {

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {

  }


  @Get("")
  @ApiQuery({ name: 'label', required: false })
  @ApiQuery({ name: 'displayName', required: false })
  @ApiQuery({ name: 'draft', type: "boolean", required: false })
  @ApiBearerAuth()
  @CheckPermissions(Action.READ, Subject.PRODUCT)
  async fetch(@CurrentUser() user: User, @Pagination() pagination: PaginateOptions,
    @Query('label') label?: string, @Query('displayName') displayName?: string, @Query('draft') draft?: string) {
    console.log(draft)
    return await this.queryBus.execute<FetchProductsQuery>(
      new FetchProductsQuery(user.id, pagination, label, displayName, draft == "true" ? true : false)
    )
  }

  @Get(':id')
  @ApiBearerAuth()
  @CheckPermissions(Action.READ, Subject.PRODUCT)
  async get(@CurrentUser() user: User, @Param('id') productId: string) {
    return await this.queryBus.execute<GetProductQuery>(
      new GetProductQuery(productId, user.id)
    )
  }

  @Post('draft')
  @ApiBearerAuth()
  @CheckPermissions(Action.CREATE, Subject.PRODUCT)
  async draft(@CurrentUser() user: User) {
    return await this.commandBus.execute<DraftProductCommand>(
      new DraftProductCommand(user.id)
    )
  }

  @Patch('update/:productId')
  @ApiBearerAuth()
  @CheckPermissions(Action.UPDATE, Subject.PRODUCT)
  async update(@CurrentUser() user: User, @Param('productId') productId: string, @Body() payload: UpdateProductDto) {
    return await this.commandBus.execute<UpdateProductCommand>(
      new UpdateProductCommand(productId, user.id, {
        displayName: payload.displayName,
        description: payload.description,
        label: payload.label
      })
    )
  }

  @Post('submit/:productId')
  @ApiBearerAuth()
  @CheckPermissions(Action.UPDATE, Subject.PRODUCT)
  async submit(@CurrentUser() user: User, @Param('productId') productId: string) {
    return await this.commandBus.execute<SubmitProductCommand>(
      new SubmitProductCommand(productId, user.id)
    )
  }

}
