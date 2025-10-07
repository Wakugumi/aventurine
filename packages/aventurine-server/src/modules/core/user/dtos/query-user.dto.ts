import { IsEmail, IsEnum, IsString } from 'class-validator';
import { RolePermissions } from 'src/engine/access-control/roles/roles.config';

export class QueryUserDto {
  @IsString()
  id?: string | null;

  @IsString()
  username?: string | null;

  @IsString()
  fullName?: string | null;

  @IsEmail()
  email?: string | null;

  @IsEnum(Object.keys(RolePermissions))
  role?: string | null;
}
