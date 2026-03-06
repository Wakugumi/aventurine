import { Field, InputType } from '@nestjs/graphql';
import { CreateOrderItemInput } from './create-order-item.input';

@InputType()
export class CreateOrderInput {
  @Field({ nullable: true })
  notes?: string;

  @Field()
  storeId: string;

  @Field()
  userStoreId: string;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}
