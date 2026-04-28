import { Entity, PrimaryColumn, Column, OneToMany, Index, PrimaryGeneratedColumn, Relation, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique } from 'typeorm';
import { Price } from '../price/price.entity';
import { User } from '../user/user.entity';
import { FileRecord } from 'src/modules/file-store/file-store.entity';
import { ProductStatus } from './types/product-status.enum';
import { MenuItem } from 'src/modules/menu/entities/menu-item.entity';

@Entity('product')
@Index('UQ_PRODUCT_LABEL', ['label'], { unique: true })
@Index('IDX_PRODUCT_ID_OWNER_ID', ['id', 'ownerId'])
@Index('IDX_PRODUCT_DISPLAY_NAME', ['displayName'])
@Unique('UQ_PRODUCT_LABEL_PER_USER', ['label', 'ownerId'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName?: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User)
  owner: Relation<User>

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  images?: FileRecord[];

  @OneToMany(() => Price, (price) => price.product, { eager: true })
  prices: Relation<Price>

  @OneToMany(() => MenuItem, (item) => item.product)
  menuItems: Relation<MenuItem[]>;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;
}
