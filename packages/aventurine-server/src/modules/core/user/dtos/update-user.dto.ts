import { IsBoolean, IsEmail, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
  @Matches(/^[a-z0-9_]+$/, {
    message:
      'Username can only contain lowercase letters, numbers, and underscores',
  })
  username?: string;

  @IsString()
  @Length(1, 255)
  fullName?: string;

  @IsEmail()
  email?: string;

  @IsString()
  avatar?: string;
}
