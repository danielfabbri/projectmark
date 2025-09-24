import { IsString, IsNotEmpty, IsUrl, MaxLength, MinLength, IsIn } from "class-validator";

export class CreateResourceDto {
  @IsString({ message: "URL must be a string" })
  @IsNotEmpty({ message: "URL is required" })
  @IsUrl({}, { message: "URL must be a valid URL" })
  @MaxLength(2048, { message: "URL must not exceed 2048 characters" })
  url!: string;

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  @MinLength(1, { message: "Description must be at least 1 character long" })
  @MaxLength(1000, { message: "Description must not exceed 1000 characters" })
  description!: string;

  @IsString({ message: "Type must be a string" })
  @IsNotEmpty({ message: "Type is required" })
  @IsIn(["link", "document", "image", "video", "audio", "other"], { 
    message: "Type must be one of: link, document, image, video, audio, other" 
  })
  type!: string;
}
