import {
  Column,
  CreateDateColumn,
  DataSource,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DataSourceEntity } from '../data-source/data-source.entity';
import { FieldMetadataEntity } from '../field-metadata/field-metadata.entity';

@Entity('objectMetadata')
@Unique('IDX_OBJECT_METADATA_NAME_SINGULAR_TENANT_ID_UNIQUE', [
  'nameSingular',
  'tenantId',
])
@Unique('IDX_OBJECT_METADATA_NAME_PLURAL_TENANT_ID_UNIQUE', [
  'namePlural',
  'tenantId',
])
export class ObjectMetadataEntity implements Required<ObjectMetadataEntity> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'uuid' })
  standardId: string | null;

  @Column({ nullable: false, type: 'uuid' })
  dataSourceId: string;

  @ManyToOne(() => DataSourceEntity, (source) => source.objects)
  @JoinColumn({ name: 'dataSourceId' })
  dataSource: Relation<DataSourceEntity>;

  @Column({ nullable: false, type: 'char' })
  nameSingular: string;

  @Column({ nullable: false, type: 'char' })
  namePlural: string;

  @Column({ nullable: false, type: 'char' })
  labelSingular: string;

  @Column({ nullable: false, type: 'char' })
  labelPlural: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ nullable: true, type: 'varchar' })
  icon: string | null;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isSystem: boolean;

  @Column({ default: false })
  isSearchable: boolean;

  @Column({ type: 'uuid', nullable: false })
  tenantId: string;

  @OneToMany(() => FieldMetadataEntity, (field) => field.object, {
    cascade: true,
  })
  fields: Relation<FieldMetadataEntity[]>;

  // TODO: attach to index metadata entity
  @OneToMany(() => Any, (index) => index)
  indexMetadatas: Relation<any[]>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // TODO: Define relation to object permissions and field permissions
}
