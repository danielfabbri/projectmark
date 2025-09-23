import { ITopicFactory } from "./types/ITopicFactory";
import { Topic } from "./Topic";
import { v4 as randomUUID } from "uuid";

export class TopicFactory implements ITopicFactory {

  createNew(name: string, content: string, parentTopicId?: string): Topic {
    return new Topic({
      id: randomUUID(),
      topicId: randomUUID(),
      name,
      content,
      version: 1,
      parentTopicId,
    });
  }
  
  createNewVersion(oldTopic: Topic, content: string, name?: string, parentTopicId?: string): Topic {
    return new Topic({
      id: randomUUID(),
      topicId: oldTopic.topicId,
      name: name || oldTopic.name,
      content,
      version: oldTopic.version + 1,
      parentTopicId: parentTopicId !== undefined ? parentTopicId : oldTopic.parentTopicId,
    });
  }
}
