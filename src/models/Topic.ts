import { BaseEntity } from "./BaseEntity";
import { ITopic } from "./types/ITopic";

export class Topic extends BaseEntity implements ITopic {
  public topicId: string;
  public name: string;
  public content: string;
  public version: number;
  public parentTopicId?: string;

  constructor(props: Omit<ITopic, "createdAt" | "updatedAt">) {
    super(props.id);
    this.topicId = props.topicId;
    this.name = props.name;
    this.content = props.content;
    this.version = props.version;
    this.parentTopicId = props.parentTopicId;
  }
}
