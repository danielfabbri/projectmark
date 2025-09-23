import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class PathQueryDto {
  @IsString({ message: "From parameter must be a string" })
  @IsNotEmpty({ message: "From parameter is required" })
  @IsUUID(4, { message: "From parameter must be a valid UUID" })
  from: string;

  @IsString({ message: "To parameter must be a string" })
  @IsNotEmpty({ message: "To parameter is required" })
  @IsUUID(4, { message: "To parameter must be a valid UUID" })
  to: string;
}
