import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { MenuItemGroup } from './menu-item-group.entity';
import { Product } from '../product/product.entity';

@Entity('menu_item')
export class MenuItem {
  @PrimaryColumn({ type: 'char', length: 255 })
  id: string;

  @ManyToOne(() => Product, (product) => product.menuItems)
  product: Product;

  @ManyToOne(() => MenuItemGroup, (group) => group.menuItems)
  menuItemGroup: MenuItemGroup;
}
