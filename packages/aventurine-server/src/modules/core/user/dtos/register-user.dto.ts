import { IsString, Length, Matches } from "class-validator";

export class RegisterUserDto {

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
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  password: string;
}
