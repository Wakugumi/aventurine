import { Injectable, Logger } from '@nestjs/common';
import { ConfigStorageInterface } from './interfaces/config-storage.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConfigStorageService implements ConfigStorageInterface {
  private readonly logger = new Logger(ConfigStorageService.name);

  construcutor();
}
