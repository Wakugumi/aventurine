import { Entity, Column, ManyToOne, Index, PrimaryGeneratedColumn, Relation, JoinColumn } from 'typeorm';
import { CurrencyCode } from './types/currency.enum';
import { Product } from 'src/modules/core/product/product.entity';

@Entity('price')
@Index('UQ_PRICE_LABEL_OWNERID', ['label', 'ownerId'], { unique: true })
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 4, })
  amount: number;

  @Column({ type: 'varchar', length: 3 }) // let be varchar for easire migraiton
  currencyCode: CurrencyCode;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayLabel?: string;

  @Column()
  productId: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => Product, (product) => product.prices)
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  taxBehavior?: string;

}
