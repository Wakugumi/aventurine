import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) { }

  async ensureOnwership(storeId: string, userId: string) {
    return await this.storeRepository.findOneByOrFail({ id: storeId, ownerId: userId })
  }

  async create(userId: string, createStoreDto: CreateStoreDto) {
    try {
      const store = this.storeRepository.create({
        ownerId: userId,
        displayName: createStoreDto.displayName ?? createStoreDto.label,
        ...createStoreDto
      });
      return this.storeRepository.save(store);

    }

    catch (error) {
      throw new ForbiddenException(error)
    }
  }

  findAll(): Promise<Store[] | null> {
    return this.storeRepository.find({ relations: ['menus'] });
  }

  findOne(id: string): Promise<Store> {
    return this.storeRepository.findOneOrFail({
      where: { id },
      relations: ['menus', 'owner'],
    });
  }

  async findByUserId(userId: string): Promise<Store[] | null> {
    return this.storeRepository.find({
      where: { ownerId: userId },
      relations: ['menus', 'owner'],
    });
  }

  async update(storeId: string, userId: string, payload: UpdateStoreDto) {
    await this.storeRepository.update({ id: storeId, ownerId: userId }, payload);
    return this.findOne(storeId);
  }

  async remove(id: string) {
    const store = await this.findOne(id);
    return this.storeRepository.remove(store as Store);
  }
}
