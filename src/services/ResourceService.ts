import { IResource } from "../models/types/IResource";
import { Resource } from "../models/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { v4 as randomUUID } from "uuid";

export class ResourceService {
  private repository: ResourceRepository;

  constructor(repository: ResourceRepository) {
    this.repository = repository;
  }

  /**
   * Criar um novo recurso para um tópico
   */
  async createResource(topicId: string, data: Omit<IResource, "id" | "topicId" | "createdAt" | "updatedAt">): Promise<IResource> {
    const resource = new Resource({
      id: randomUUID(),
      topicId,
      url: data.url,
      description: data.description,
      type: data.type,
    });
    
    await this.repository.save(resource);
    return resource;
  }

  /**
   * Obter todos os recursos de um tópico
   */
  async getResourcesByTopicId(topicId: string): Promise<IResource[]> {
    const allResources = await this.repository.findAll();
    return allResources.filter(resource => resource.topicId === topicId);
  }

  /**
   * Obter um recurso por ID
   */
  async getResourceById(id: string): Promise<IResource | null> {
    return await this.repository.findById(id);
  }

  /**
   * Atualizar um recurso
   */
  async updateResource(id: string, data: Partial<Pick<IResource, "url" | "description" | "type">>): Promise<IResource | null> {
    const resource = await this.repository.findById(id);
    if (!resource) return null;

    const updatedResource = new Resource({
      ...resource,
      url: data.url || resource.url,
      description: data.description || resource.description,
      type: data.type || resource.type,
    });

    updatedResource.touch();
    await this.repository.update(updatedResource);
    return updatedResource;
  }

  /**
   * Deletar um recurso
   */
  async deleteResource(id: string): Promise<boolean> {
    const resource = await this.repository.findById(id);
    if (!resource) return false;

    await this.repository.delete(id);
    return true;
  }
}
