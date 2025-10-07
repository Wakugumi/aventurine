import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { Store } from '../store/store.entity';
import { MenuItemGroup } from './menu-item-group.entity';

@Entity('menu')
@Index('UQ_menu_label', ['label'], { unique: true })
export class Menu {
  @PrimaryColumn({ type: 'char', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName?: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column()
  storeId: string;

  @ManyToOne(() => Store, (store) => store.menus)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @OneToMany(() => MenuItemGroup, (group) => group.menu)
  menuItemGroups: MenuItemGroup[];
}
