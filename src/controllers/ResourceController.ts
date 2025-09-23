import { Request, Response } from "express";
import { ResourceService } from "../services/ResourceService";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { CreateResourceDto } from "../dtos/CreateResourceDto";
import { UpdateResourceDto } from "../dtos/UpdateResourceDto";
import { NotFoundError } from "../errors/AppError";

// Inicializar dependências
const repository = new ResourceRepository();
const service = new ResourceService(repository);

export class ResourceController {
  /**
   * Criar um novo recurso para um tópico
   */
  static async createResource(req: Request, res: Response) {
    const { topicId } = req.params;
    const createResourceDto = req.body as CreateResourceDto;

    const resource = await service.createResource(topicId, createResourceDto);
    res.status(201).json(resource);
  }

  /**
   * Obter todos os recursos de um tópico
   */
  static async getResourcesByTopic(req: Request, res: Response) {
    const { topicId } = req.params;
    const resources = await service.getResourcesByTopicId(topicId);
    res.json(resources);
  }

  /**
   * Obter um recurso por ID
   */
  static async getResourceById(req: Request, res: Response) {
    const { id } = req.params;
    const resource = await service.getResourceById(id);
    
    if (!resource) {
      throw new NotFoundError("Resource", id);
    }

    res.json(resource);
  }

  /**
   * Atualizar um recurso
   */
  static async updateResource(req: Request, res: Response) {
    const { id } = req.params;
    const updateResourceDto = req.body as UpdateResourceDto;

    const updatedResource = await service.updateResource(id, updateResourceDto);
    if (!updatedResource) {
      throw new NotFoundError("Resource", id);
    }

    res.json(updatedResource);
  }

  /**
   * Deletar um recurso
   */
  static async deleteResource(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await service.deleteResource(id);
    
    if (!deleted) {
      throw new NotFoundError("Resource", id);
    }

    res.status(204).send();
  }
}
