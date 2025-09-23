import { ITopic } from "../models/types/ITopic";
import { Topic } from "../models/Topic";
import { TopicFactory } from "../models/TopicFactory";
import { TopicRepository } from "../repositories/TopicRepository";
import logger from "../utils/logger";

export class TopicService {
  private repository: TopicRepository;
  private factory: TopicFactory;

  constructor(repository: TopicRepository, factory: TopicFactory) {
    this.repository = repository;
    this.factory = factory;
  }
  
  async createTopic(data: Omit<ITopic, "id" | "topicId" | "createdAt" | "updatedAt" | "version">): Promise<ITopic> {
    const topic = this.factory.createNew(data.name, data.content, data.parentTopicId);
    await this.repository.save(topic);

    logger.info("topic_created", {
      topicId: topic.topicId,
      id: topic.id,
      version: topic.version,
      parentTopicId: topic.parentTopicId ?? null
    });

    return topic;
  }
  
  async updateTopic(topicId: string, changes: Partial<Pick<ITopic, "name" | "content" | "parentTopicId">>): Promise<ITopic | null> {
    const latest = await this.getLatestTopic(topicId);
    if (!latest) return null;

    // Criar nova versão com as mudanças
    const newVersion = this.factory.createNewVersion(
      latest as Topic, 
      changes.content || latest.content,
      changes.name || latest.name,
      changes.parentTopicId !== undefined ? changes.parentTopicId : latest.parentTopicId
    );
    await this.repository.save(newVersion);

    logger.info("topic_version_created", {
      topicId: newVersion.topicId,
      id: newVersion.id,
      version: newVersion.version,
      parentTopicId: newVersion.parentTopicId ?? null,
    });

    return newVersion;
  }

  /**
   * Retorna a versão mais recente de um tópico
   */
  async getLatestTopic(topicId: string): Promise<ITopic | null> {
    const all = await this.repository.findAll();
    const filtered = all.filter(t => t.topicId === topicId);
    if (filtered.length === 0) return null;
    return filtered.reduce((prev, curr) => (curr.version > prev.version ? curr : prev));
  }

  /**
   * Retorna uma versão específica de um tópico
   */
  async getTopicVersion(topicId: string, version: number): Promise<ITopic | null> {
    const all = await this.repository.findAll();
    return all.find(t => t.topicId === topicId && t.version === version) || null;
  }

  /**
   * Retorna a árvore de tópicos (Composite pattern)
   */
  async getTopicTree(topicId: string): Promise<(ITopic & { children: ITopic[] }) | null> {
    const root = await this.getLatestTopic(topicId);
    if (!root) return null;

    const buildTree = async (topic: ITopic): Promise<ITopic & { children: ITopic[] }> => {
      // Buscar todos os filhos diretos deste tópico
      const all = await this.repository.findAll();
      const directChildren = all.filter(t => t.parentTopicId === topic.topicId);
      
      // Para cada filho, pegar apenas a versão mais recente
      const latestChildren = directChildren.reduce((acc, child) => {
        const existing = acc.find(c => c.topicId === child.topicId);
        if (!existing || child.version > existing.version) {
          const index = acc.findIndex(c => c.topicId === child.topicId);
          if (index >= 0) {
            acc[index] = child;
          } else {
            acc.push(child);
          }
        }
        return acc;
      }, [] as ITopic[]);

      const children = await Promise.all(latestChildren.map(c => buildTree(c)));

      return {
        ...topic,
        children,
      };
    };

    return await buildTree(root);
  }

  /**
   * Algoritmo simples de busca do menor caminho (BFS)
   */
  async findShortestPath(fromTopicId: string, toTopicId: string): Promise<string[] | null> {
    // Verificar se ambos os tópicos existem
    const fromTopic = await this.getLatestTopic(fromTopicId);
    const toTopic = await this.getLatestTopic(toTopicId);
    if (!fromTopic || !toTopic) {
      return null;
    }

    const graph = new Map<string, string[]>();
    const allTopics = await this.repository.findAll();

    // Criar mapa de versões mais recentes por topicId
    const latestVersions = new Map<string, ITopic>();
    allTopics.forEach(topic => {
      const existing = latestVersions.get(topic.topicId);
      if (!existing || topic.version > existing.version) {
        latestVersions.set(topic.topicId, topic);
      }
    });

    // Montar grafo usando apenas versões mais recentes
    latestVersions.forEach(topic => {
      if (!graph.has(topic.topicId)) graph.set(topic.topicId, []);
      if (topic.parentTopicId) {
        // bidirecional: parent -> child e child -> parent
        graph.get(topic.topicId)!.push(topic.parentTopicId);
        if (!graph.has(topic.parentTopicId)) graph.set(topic.parentTopicId, []);
        graph.get(topic.parentTopicId)!.push(topic.topicId);
      }
    });

    // BFS
    const queue: { node: string; path: string[] }[] = [{ node: fromTopicId, path: [fromTopicId] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      if (node === toTopicId) return path;
      if (visited.has(node)) continue;

      visited.add(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null;
  }
}
