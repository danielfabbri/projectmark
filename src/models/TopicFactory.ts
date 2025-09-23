import { ITopicFactory } from "./types/ITopicFactory";
import { Topic } from "./Topic";
import { v4 as randomUUID } from "uuid";
// import { randomUUID } from "crypto";

export class TopicFactory implements ITopicFactory {
  /**
   * Cria um novo tópico inicial
   */
  createNew(name: string, content: string, parentTopicId?: string): Topic {
    return new Topic({
      id: randomUUID(),           // id único da instância
      topicId: randomUUID(),      // id lógico do tópico
      name,
      content,
      version: 1,
      parentTopicId,
    });
  }

  /**
   * Cria uma nova versão de um tópico existente
   */
  createNewVersion(oldTopic: Topic, content: string): Topic {
    return new Topic({
      id: randomUUID(),           // nova instância
      topicId: oldTopic.topicId,  // mantém o id lógico
      name: oldTopic.name,
      content,
      version: oldTopic.version + 1,
      parentTopicId: oldTopic.topicId, // referencia a versão anterior
    });
  }
}
