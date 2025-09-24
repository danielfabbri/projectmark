import { IsUUID } from "class-validator";

export class TopicParamsDto {
  @IsUUID(4, { message: "Topic ID must be a valid UUID" })
  topicId!: string;
}

export class TopicVersionParamsDto {
  @IsUUID(4, { message: "Topic ID must be a valid UUID" })
  topicId!: string;

  @IsUUID(4, { message: "Version must be a valid UUID" })
  version!: string;
}

export class ResourceParamsDto {
  @IsUUID(4, { message: "Resource ID must be a valid UUID" })
  id!: string;
}

export class TopicResourceParamsDto {
  @IsUUID(4, { message: "Topic ID must be a valid UUID" })
  topicId!: string;
}
