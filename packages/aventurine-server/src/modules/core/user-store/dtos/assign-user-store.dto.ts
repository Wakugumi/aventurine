import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RolePermissions } from 'src/engine/access-control/roles/roles.config';

export class AssignUserStoreDto {
  @IsString()
  userId: string;

  @IsString()
  storeId: string;

  @IsEnum(Object.keys(RolePermissions))
  @IsOptional()
  role?: string;
}
