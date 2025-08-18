/**
 * Aventurine Server
 * Metadata Modules -> Data Source
 * Holds as a housing space of objects that links them to where the data is present.
 */

import {
  Column,
  CreateDateColumn,
  DataSourceOptions,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Reads from typeorm, return types of database they support
export type DataSourceType = DataSourceOptions['type'];

@Entity('dataSource')
@Index('IDX_DATA_SOURCE_TENANT_ID_CREATED_AT', ['tenantId', 'createdAt'])
export class DataSourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  schema: string;

  @Column({ type: 'enum', enum: ['postgres'], default: 'postgres' })
  type: DataSourceType;

  @Column({ default: false })
  isRemote: boolean;

  // TODO: Link this to Object metadata entity as one to many
  @OneToMany(() => any, (object) => object.dataSource)
  objects: any;

  @Column({ nullable: false, type: 'uuid' })
  tenantId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
