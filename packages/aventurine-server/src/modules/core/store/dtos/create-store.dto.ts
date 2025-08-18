import { IsOptional, IsString, Length } from 'class-validator';
export class CreateStoreDto {
  @IsString()
  @Length(1, 255)
  id: string;

  @IsString()
  @Length(1, 255)
  label: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;
}
