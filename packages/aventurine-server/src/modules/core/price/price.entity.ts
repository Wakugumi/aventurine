import { Entity, PrimaryColumn, Column, ManyToOne, Index } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('price')
@Index('UQ_price_nickname', ['nickname'], { unique: true })
export class Price {
  @PrimaryColumn({ type: 'char', length: 255 })
  id: string;

  @Column({ type: 'int', nullable: true })
  unitAmount?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  unitAmountDecimal?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currencyCode?: string;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayLabel?: string;

  @ManyToOne(() => Product, (product) => product.prices)
  product: Product;

  @Column({ type: 'varchar', length: 255, nullable: true })
  taxBehavior?: string;
}
