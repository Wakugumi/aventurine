import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { IndexFieldMetadataEntity } from '../index-metadata/index-field-metadata.entity';
import { ObjectMetadataEntity } from '../object-metadata/object-metadata.entity';

@Entity('fieldMetadata')
export class FieldMetadataEntity<
  T extends FieldMetadataType = FieldMetadataEntity,
> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'uuid' })
  standardId: string | null;

  @Column({ type: 'uuid' })
  objectMetadataId: string;

  @ManyToOne(() => ObjectMetadataEntity, (object) => object.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  object: Relation<ObjectMetadataEntity>;

  @OneToMany(() => IndexFieldMetadataEntity, (index) => index.fieldMetadata, {
    cascade: true,
  })
  indexFieldMetadatas: Relation<IndexFieldMetadataEntity>;
}
