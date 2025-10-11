import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  OneToMany,
  Relation,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStore } from '../user-store/user-store.entity';

@Entity('user')
@Index('UQ_USER_USERNAME', ['username'], { unique: true })
@Index('UQ_USER_EMAIL', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastUpdateAvatar?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @OneToMany(() => UserStore, (store) => store.user)
  userStores?: Relation<UserStore>;

  @Column({ type: 'boolean', default: true })
  isOwner: boolean;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;
}
