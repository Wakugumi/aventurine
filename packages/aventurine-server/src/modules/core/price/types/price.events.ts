import { Price } from "../price.entity";

export enum PriceEvents {
  UPDATED = 'price.updated',
  DELETED = 'price.deleted'
}

export class PriceEventPayload {
  constructor(public readonly priceId: string, public readonly payload?: Partial<Price>) { }
}
