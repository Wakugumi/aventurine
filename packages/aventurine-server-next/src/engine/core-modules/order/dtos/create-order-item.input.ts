import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  unitPrice: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  menuItemId: string;
}
