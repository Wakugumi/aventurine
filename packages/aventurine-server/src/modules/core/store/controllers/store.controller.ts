import { Controller, Get, Req, Res } from '@nestjs/common';
import { StoreService } from '../store.service';
import { Request, Response } from 'express';

@Controller(['store'])
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findByUserId(id: string) {}

  @Get('/get')
  async get(@Req() request: Request, @Res() response: Response) {}
}
