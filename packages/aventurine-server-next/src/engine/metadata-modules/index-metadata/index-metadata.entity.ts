import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ObjectMetadataEntity } from '../object-metadata/object-metadata.entity';
import { IndexType } from './types/index-types.enum';

@Entity('indexMetadata')
export class IndexMetadataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'uuid' })
  tenantId: string;

  @Column({ nullable: false, type: 'uuid' })
  objectMetadataId: string;

  @ManyToOne(() => ObjectMetadataEntity, (object) => object.indexMetadatas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'objectMetadataId' })
  objectMetadata: Relation<ObjectMetadataEntity>;

  // TODO: add relation one to many with index field metadatas
  indexFieldMetadatas: Relation<any[]>;

  @Column({ default: false })
  isUnique: boolean;

  @Column({ default: false })
  isCustom: boolean;

  @Column({ nullable: true, type: 'text' })
  indexWhereClause?: string | null;

  @Column({
    type: 'enum',
    enum: IndexType,
    default: IndexType.BTREE,
    nullable: false,
  })
  indexType: IndexType;
}
