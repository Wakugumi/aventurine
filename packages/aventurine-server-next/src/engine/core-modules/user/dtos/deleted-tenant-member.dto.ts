import { Field, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/engine/api/graphql/scalars/uuid.scalar';
import { FullName } from './tenant-member.dto';

@ObjectType()
export class DeletedWorkspaceMember {
  @IDField(() => UUIDScalarType)
  id: string;

  @Field(() => FullName)
  name: FullName;

  @Field({ nullable: false })
  userEmail: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;

  @Field(() => String, { nullable: true })
  userWorkspaceId: string | null;
}
