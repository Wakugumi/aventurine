import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  OneToMany,
  Relation,
} from 'typeorm';
import { UserStore } from '../user-store/user-store.entity';

@Entity('user')
@Index('UQ_USER_USERNAME', ['username'], { unique: true })
@Index('UQ_USER_EMAIL', ['email'], { unique: true })
export class User {
  @PrimaryColumn({ type: 'char', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @OneToMany(() => UserStore, (store) => store.user)
  userStores: Relation<UserStore>;

  @Column({ type: 'boolean' })
  isOwner: boolean;
}
