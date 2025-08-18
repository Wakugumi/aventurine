import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
Store;
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  create(createStoreDto: CreateStoreDto) {
    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  findAll(): Promise<Store[] | null> {
    return this.storeRepository.find({ relations: ['menus'] });
  }

  findOne(id: string): Promise<Store | null> {
    return this.storeRepository.findOne({
      where: { id },
      relations: ['menus'],
    });
  }

  async findByUserId(userId: string): Promise<Store[] | null> {
    return this.storeRepository.find({
      where: {},
      relations: ['menus'],
    });
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    await this.storeRepository.update(id, updateStoreDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const store = await this.findOne(id);
    return this.storeRepository.remove(store as Store);
  }
}
