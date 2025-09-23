import { IsString, IsOptional, IsUUID, MaxLength, MinLength } from "class-validator";

export class UpdateTopicDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MinLength(1, { message: "Name must be at least 1 character long" })
  @MaxLength(255, { message: "Name must not exceed 255 characters" })
  name?: string;

  @IsOptional()
  @IsString({ message: "Content must be a string" })
  @MinLength(1, { message: "Content must be at least 1 character long" })
  @MaxLength(10000, { message: "Content must not exceed 10000 characters" })
  content?: string;

  @IsOptional()
  @IsString({ message: "Parent topic ID must be a string" })
  @IsUUID(4, { message: "Parent topic ID must be a valid UUID" })
  parentTopicId?: string;
}
