import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Store } from '../store/store.entity';
import {
  Role,
  RolePermissions,
} from 'src/engine/access-control/roles/roles.config';

@Entity('userStore')
export class UserStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  assignedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.userStores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column({ type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.userStores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Relation<Store>;

  @Column({
    type: 'enum',
    enum: Object.keys(RolePermissions),
    default: 'owner',
  })
  role: Role;
}
