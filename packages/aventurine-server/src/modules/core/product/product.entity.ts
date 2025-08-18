import { Entity, PrimaryColumn, Column, OneToMany, Index } from 'typeorm';
import { MenuItem } from '../menu/menu-item.entity';
import { Price } from '../price/price.entity';

@Entity('product')
@Index('UQ_product_label', ['label'], { unique: true })
export class Product {
  @PrimaryColumn({ type: 'char', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'bytea', nullable: true })
  images?: Buffer;

  @OneToMany(() => Price, (price) => price.product)
  prices: Price[];

  @OneToMany(() => MenuItem, (item) => item.product)
  menuItems: MenuItem[];
}
