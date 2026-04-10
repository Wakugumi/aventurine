import { Module } from "@nestjs/common";
import { PriceService } from "./price.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Price } from "./price.entity";
import { CreatePriceHandler } from "./commands/handlers/create-price.handler";
import { UpdatePriceHandler } from "./commands/handlers/update-price.handler";
import { FetchPricesHandler } from "./queries/handlers/fetch-prices.handler";
import { GetPriceHandler } from "./queries/handlers/get-price.handler";
import { DeletePriceHandler } from "./commands/handlers/delete-price.handler";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PriceController } from "./price.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Price]), EventEmitterModule],
  providers: [PriceService, CreatePriceHandler, UpdatePriceHandler, FetchPricesHandler, GetPriceHandler, DeletePriceHandler],
  controllers: [PriceController],
  exports: [TypeOrmModule, PriceService, PriceModule]
})
export class PriceModule { }
