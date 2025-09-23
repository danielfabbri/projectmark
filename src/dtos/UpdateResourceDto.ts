import { IsString, IsOptional, IsUrl, MaxLength, MinLength, IsIn } from "class-validator";

export class UpdateResourceDto {
  @IsOptional()
  @IsString({ message: "URL must be a string" })
  @IsUrl({}, { message: "URL must be a valid URL" })
  @MaxLength(2048, { message: "URL must not exceed 2048 characters" })
  url?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(1, { message: "Description must be at least 1 character long" })
  @MaxLength(1000, { message: "Description must not exceed 1000 characters" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Type must be a string" })
  @IsIn(["link", "document", "image", "video", "audio", "other"], { 
    message: "Type must be one of: link, document, image, video, audio, other" 
  })
  type?: string;
}
