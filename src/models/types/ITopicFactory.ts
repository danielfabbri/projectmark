import { Topic } from "../Topic";

export interface ITopicFactory {
  /**
   * Cria um novo tópico inicial
   */
  createNew(name: string, content: string, parentTopicId?: string): Topic;

  /**
   * Cria uma nova versão de um tópico existente
   */
  createNewVersion(oldTopic: Topic, content: string, name?: string, parentTopicId?: string): Topic;
}
