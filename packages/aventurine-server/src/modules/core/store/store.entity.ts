import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserStore } from '../user-store/user-store.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Menu } from '../menu/menu.entity';

@ObjectType('Store')
@Entity({ name: 'store' })
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

  @OneToMany(() => UserStore, (userStore) => userStore.store, {
    onDelete: 'CASCADE',
  })
  userStores: Relation<UserStore>;

  @Field({ description: 'Menu that is applied to this store' })
  @OneToMany(() => Menu, (menu) => menu.store, { onDelete: 'SET NULL' })
  menus: Relation<Menu>;
}
