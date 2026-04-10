import { Query } from '@nestjs/cqrs'
import { Store } from '../store.entity';

export class GetStoreQuery extends Query<Store> {
  constructor(
    public readonly storeId: string,

  ) { super(); }


}
