import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './enums/order-status.enum';

@Entity({ name: 'order', schema: 'core' })
@ObjectType()
@Index('IDX_ORDER_STORE_ID', ['storeId'])
@Index('IDX_ORDER_USER_STORE_ID', ['userStoreId'])
export class Order {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => OrderStatus)
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  totalAmount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Field()
  @Column({ type: 'uuid' })
  storeId: string;

  @Field()
  @Column({ type: 'uuid' })
  userStoreId: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: Relation<OrderItem[]>;
}
