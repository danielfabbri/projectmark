import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsString({ message: "Email must be a string" })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  @MaxLength(255, { message: "Email must not exceed 255 characters" })
  email: string | undefined;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(1, { message: "Name must be at least 1 character long" })
  @MaxLength(255, { message: "Name must not exceed 255 characters" })
  name: string | undefined;
  role: "admin" | "editor" | "viewer" | undefined;
}
