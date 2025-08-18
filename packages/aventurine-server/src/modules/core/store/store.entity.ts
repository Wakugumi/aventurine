import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserStore } from '../user-store/user-store.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Column({ type: 'varchar', nullable: true })
  displayName?: string | null;

  @Column({ type: 'varchar', nullable: true })
  logo?: string | null;

  @Column({ type: 'varchar', default: '' })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  contactPhone?: string | null;

  @Column({ type: 'varchar', nullable: true })
  contactEmail?: string | null;

  @OneToMany(() => UserStore, (userStore) => userStore.store, {
    onDelete: 'CASCADE',
  })
  userStores: Relation<UserStore>;
}
