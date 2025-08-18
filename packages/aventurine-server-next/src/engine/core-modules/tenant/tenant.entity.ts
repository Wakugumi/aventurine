import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';

@Entity({ name: 'tenant', schema: 'core' })
@ObjectType()
export class Tenant {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  //TODO: link to tenant user entity later
  tenantUsers: Relation<any[]>;

  @Field()
  @Column({ default: '' })
  databaseUrl: string;

  @Field()
  @Column({ unique: true })
  subdomain: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', unique: true, nullable: true })
  customDomain: string | null;

  // TODO: link to the role entity DTO
  @Column({ nullable: true, type: 'uuid' })
  defaultRoleId: string | null;
}
