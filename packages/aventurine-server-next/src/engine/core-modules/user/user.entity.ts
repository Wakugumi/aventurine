import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { UserTenant } from '../user-tenant/user-tenant.entity';

@Entity({ name: 'user', schema: 'core' })
@ObjectType()
@Index('UQ_USER_EMAIL', ['email'], {
  unique: true,
  where: '"deletedAt" IS NULL', // remove unique property of a record that is deleted
})
export class User {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ default: '' })
  firstName: string;

  @Field()
  @Column({ default: '' })
  lastName: string;

  @BeforeInsert()
  @BeforeUpdate()
  formatEmail?() {
    this.email = this.email.toLowerCase();
  }

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  defaultAvatarUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  passwordHash: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatetAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @Field(() => [UserTenant])
  @OneToMany(() => Tenant, (tenant) => tenant.tenantUsers)
  userTenants: Relation<UserTenant[]>;
}
