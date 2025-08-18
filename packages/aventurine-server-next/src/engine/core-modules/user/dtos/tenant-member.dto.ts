import { Field, ObjectType } from '@nestjs/graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';

@ObjectType()
export class FullName {
  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;
}

@ObjectType()
export class TenantMember {
  @IDField(() => UUIDScalarType)
  id: string;

  @Field(() => FullName, { nullable: false })
  name: FullName;

  @Field({ nullable: false })
  userEmail: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field({ nullable: true })
  timezone: string;

  @Field(() => RoleDTO)
  roles?: RoleDTO;

  @Field(() => String)
  userTenantId?: string;
}
