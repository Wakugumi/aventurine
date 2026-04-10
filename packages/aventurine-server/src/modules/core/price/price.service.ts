import { HttpStatus, Injectable } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { Price } from "./price.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrencyCode } from "./types/currency.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PriceEventPayload, PriceEvents } from "./types/price.events";
import { PriceException, PriceExceptionCode } from "./price.exception";

export interface ResolvedPrice {
  amount: number | string,
  currency: string
}

@Injectable()
export class PriceService {

  constructor(@InjectRepository(Price) private readonly priceRepo: Repository<Price>,
    private readonly eventEmitter: EventEmitter2) {

  }

  async ensureOwnership(priceId: string, userId: string) {
    return await this.priceRepo.existsBy({ id: priceId, ownerId: userId })
  }

  async create(payload: DeepPartial<Price>) {
    if (payload.amount! < 0)
      throw new PriceException("Cannot have negative value on unit amount", PriceExceptionCode.INVALID_DATA, "Cannot have negative value on price unit amount", HttpStatus.BAD_REQUEST)

    return await this.priceRepo.save({
      label: payload.label,
      currencyCode: payload.currencyCode ?? CurrencyCode.IDR,
      displayLabel: payload.displayLabel ?? payload.label,
      amount: payload.amount,
      productId: payload.productId,
      ownerId: payload.ownerId
    })
  }

  async update(priceId: string, userId: string, payload: DeepPartial<Price>) {

    if (! await this.priceRepo.existsBy({ id: priceId, ownerId: userId }))
      throw new PriceException("No Price associated with given id and owner id", PriceExceptionCode.PRICE_NOT_FOUND)

    if (payload.amount! < 0)
      throw new PriceException("Cannot have negative value on unit amount", PriceExceptionCode.INVALID_DATA)
    try {

      return await this.priceRepo.update(priceId, payload)
    } finally {

      this.eventEmitter.emit(PriceEvents.UPDATED, new PriceEventPayload(priceId))

    }
  }

  async findOneById(id: string) {
    return this.priceRepo.findOneByOrFail({ id: id })
  }

  async delete(priceId: string) {
    const price = await this.priceRepo.findOneByOrFail({ id: priceId })
    try {

      await this.priceRepo.delete({ id: priceId })
      return price
    } finally {
      this.eventEmitter.emit(PriceEvents.DELETED, new PriceEventPayload(priceId, price))
    }

  }

}
