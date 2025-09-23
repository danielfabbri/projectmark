import { BaseEntity } from "./BaseEntity";
import { IResource } from "./types/IResource";

export class Resource extends BaseEntity implements IResource {
  public topicId: string;
  public url: string;
  public description: string;
  public type: string;

  constructor(props: Omit<IResource, "createdAt" | "updatedAt">) {
    super(props.id);
    this.topicId = props.topicId;
    this.url = props.url;
    this.description = props.description;
    this.type = props.type;
  }
}
