import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
export class UserService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async deleteUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }
}
