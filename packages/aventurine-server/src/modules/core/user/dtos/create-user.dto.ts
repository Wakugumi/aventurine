import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  id: string;

  @IsString()
  @Length(1, 255)
  username: string;

  @IsString()
  @Length(1, 255)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 255)
  passwordHash: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
