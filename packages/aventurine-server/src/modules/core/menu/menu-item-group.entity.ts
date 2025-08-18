import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_item_group')
@Index('UQ_menu_item_group_label', ['label'], { unique: true })
export class MenuItemGroup {
  @PrimaryColumn({ type: 'char', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'bytea', nullable: true })
  tag?: Buffer;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName?: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Menu, (menu) => menu.menuItemGroups)
  menu: Menu;

  @OneToMany(() => MenuItem, (item) => item.menuItemGroup)
  menuItems: MenuItem[];
}
