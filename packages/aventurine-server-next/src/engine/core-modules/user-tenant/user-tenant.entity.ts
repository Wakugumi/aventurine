import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'userTenant', schema: 'core' })
@ObjectType()
@Unique('IDX_USER_TENANT_USER_ID_TENANT_ID_UNIQUE', ['userId', 'tenantId'])
@Index('IDX_USER_TENANT_USER_ID', ['userId'])
@Index('IDX_USER_TENANT_TENANT_ID', ['tenantId'])
export class UserTenant {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: true })
  defaultAvatarUrl: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @DeleteDateColumn()
  deletedAt: Date;

  @Field({ nullable: false })
  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.userTenants, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @Field({ nullable: false })
  @Column({ type: 'uuid' })
  tenantId: string;

  @Field(() => Tenant, { nullable: true })
  @ManyToOne(() => Tenant, (tenant) => tenant.tenantUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant: Relation<Tenant>;

  // TODO: Use the right object later
  @Field(() => [], { nullable: true })
  permissionFlags?: any;

  // TODO: Use the right object later
  @Field(() => [], { nullable: true })
  objectPermissions?: any;
}
