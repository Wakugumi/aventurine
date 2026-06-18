import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'orderItem', schema: 'core' })
@ObjectType()
@Index('IDX_ORDER_ITEM_ORDER_ID', ['orderId'])
@Index('IDX_ORDER_ITEM_MENU_ITEM_ID', ['menuItemId'])
export class OrderItem {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  unitPrice: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field()
  @Column({ type: 'uuid' })
  orderId: string;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Relation<Order>;

  @Field()
  @Column({ type: 'uuid' })
  menuItemId: string;
}
