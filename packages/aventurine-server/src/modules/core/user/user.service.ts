import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      createdAt: new Date(),
    });
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user as User);
  }

  async createNewOwner(dto: CreateUserDto) {
    const user = this.userRepository.create({
      ...dto,
      isOwner: true,
    });
  }
}
