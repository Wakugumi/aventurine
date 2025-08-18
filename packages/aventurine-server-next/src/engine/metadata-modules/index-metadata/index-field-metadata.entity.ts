import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { IndexMetadataEntity } from './index-metadata.entity';
import { FieldMetadataEntity } from '../field-metadata/field-metadata.entity';

@Entity('indexFieldMetadata')
export class IndexFieldMetadataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  indexMetadataId: string;

  @ManyToOne(() => IndexMetadataEntity, (index) => index.indexFieldMetadatas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'indexMetadataId' })
  indexMetadata: Relation<IndexMetadataEntity>;

  @Column({type:'uuid'})
  fieldMetadataId:string;

  @ManyToOne(() => FieldMetadataEntity, (field) => field.)
  @JoinColumn()
  fieldMetadata: Relation<FieldMetadataEntity>;

  @Column({nullable: false})
  order:number;

  @CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date;
}
