import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiKey } from 'src/engine/api-key/api-key.entity';
import { User } from '../user/user.entity';
import { Menu } from 'src/modules/menu/entities/menu.entity';

@ObjectType('Store')
@Entity({ name: 'store' })
@Index('UQ_STORE_LABEL', ['label'], { unique: true })
@Index('IDX_STORE_LABEL_OWNER', ['label', 'ownerId'])
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @Field({ description: 'The label of the store' })
  label: string;

  @Field({ description: 'The display name of the store' })
  @Column({ type: 'varchar', nullable: true })
  displayName?: string | null;

  @Field({ description: 'The logo url of the store', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  logo?: string | null;

  @Field({ description: 'The address of the store' })
  @Column({ type: 'varchar', default: '' })
  address?: string | null

  @Field({ description: 'The contact phone of the store', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  contactPhone?: string | null;

  @Field({ description: 'The contact email of the store', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  contactEmail?: string | null;

  @Column({ type: "uuid" })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.stores)
  owner: Relation<User>;

  @Field({ description: 'Menu that is applied to this store' })
  @OneToMany(() => Menu, (menu) => menu.store, { onDelete: 'SET NULL' })
  menus: Relation<Menu[]>;

  @OneToMany(() => ApiKey, (apiKey) => apiKey.store)
  apiKeys: Relation<ApiKey[]>;
}
