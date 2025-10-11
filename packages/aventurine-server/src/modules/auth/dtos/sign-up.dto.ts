import { IsEmail, IsString, Length, Matches } from "class-validator";
import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from "../utils/auth.util";

export class SignUpDto {

  @IsString()
  @Matches(USERNAME_REGEX, { message: 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores.' })
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(PASSWORD_REGEX, { message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.' })
  password: string;

}
