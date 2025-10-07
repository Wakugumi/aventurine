import {
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  id: string;

  @IsString()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  @Matches(/^[a-z0-9_]+$/, {
    message:
      'Username can only contain lowercase letters, numbers, and underscores',
  })
  username: string;

  @IsString()
  @Length(1, 255)
  fullName: string;

  @IsEmail({}, { message: 'Must be in valid email format' })
  email: string;

  @IsString()
  @Length(1, 255)
  passwordHash: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isOwner?: boolean;
}
