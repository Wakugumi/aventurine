import { Test } from "@nestjs/testing";
import { PriceService } from "../price.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { Price } from "../price.entity";
import { randomUUID } from "crypto";
import { CurrencyCode } from "../types/currency.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DeleteResult, UpdateResult } from "typeorm";
import { PriceEventPayload, PriceEvents } from "../types/price.events";
import { Product } from "../../product/product.entity";
import { random } from "lodash";

describe('Price service', () => {

  let mockRepo = {
    save: jest.fn(),
    update: jest.fn(),
    findOneByOrFail: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    existsBy: jest.fn()
  }
  let priceRepo = mockRepo;
  let productRepo = mockRepo;


  let priceService: PriceService;
  let eventEmitter: EventEmitter2;


  beforeAll(async () => {
    let module = await Test.createTestingModule({
      providers: [PriceService,
        {
          provide: getRepositoryToken(Price),
          useValue: priceRepo
        }, {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productRepo
        }
      ]
    }).compile()


    priceRepo = module.get(getRepositoryToken(Price))
    priceService = module.get<PriceService>(PriceService)
    eventEmitter = module.get<EventEmitter2>(EventEmitter2)
    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(priceRepo).toBeDefined();
    expect(eventEmitter).toBeDefined();
    expect(priceService).toBeDefined();
  });


  let mockPrice: Partial<Price> = {
    id: randomUUID(),
    ownerId: randomUUID(),

    label: "label",
    currencyCode: CurrencyCode.IDR,
    amount: 5000,
    productId: randomUUID(),


  }

  it("should create new price and default displayName", async () => {
    priceRepo.existsBy.mockResolvedValueOnce(true);
    priceRepo.save.mockResolvedValueOnce(mockPrice);

    expect(await priceService.create(mockPrice)).toEqual(mockPrice)
    expect(priceRepo.save).toHaveBeenCalledWith({
      ...mockPrice,
      id: undefined,
      displayLabel: mockPrice.label
    })

  });

  it("should update and emit event", async () => {
    priceRepo.existsBy.mockResolvedValueOnce(true);
    priceRepo.update.mockResolvedValueOnce({} as UpdateResult);

    await priceService.update(mockPrice.id!, mockPrice!.ownerId!, { ...mockPrice });
    expect(eventEmitter.emit).toHaveBeenCalledWith(PriceEvents.UPDATED, new PriceEventPayload(mockPrice.id!))
    expect(priceRepo.update).toHaveBeenCalledWith(mockPrice.id, { ...mockPrice })
  });

  it('should delete and emit event', async () => {
    priceRepo.findOneByOrFail.mockResolvedValueOnce(mockPrice);

    priceRepo.delete.mockResolvedValueOnce({} as DeleteResult);

    await priceService.delete(mockPrice.id!);

    expect(priceRepo.delete).toHaveBeenCalledWith({ id: mockPrice.id });

    expect(eventEmitter.emit).toHaveBeenCalledWith(PriceEvents.DELETED, new PriceEventPayload(mockPrice.id!, mockPrice))


  });
})

