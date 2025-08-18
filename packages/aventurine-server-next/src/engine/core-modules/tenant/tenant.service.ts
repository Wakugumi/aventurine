import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { Tenant } from './tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TenantService extends TypeOrmQueryService<Tenant> {
  private readonly logging = new Logger(TenantService.name);

  constructor(
    @InjectRepository(Tenant, 'core')
    private readonly tenantRepository: Repository<Tenant>,
  ) {
    super(tenantRepository);
  }

  public async updateTenantById(
    payload: Partial<Tenant>,
    userId: string,
    tenantId: string,
  ) {}
}
