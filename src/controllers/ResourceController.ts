import { Request, Response } from "express";
import { ResourceService } from "../services/ResourceService";
import { ResourceRepository } from "../repositories/ResourceRepository";

// Inicializar dependências
const repository = new ResourceRepository();
const service = new ResourceService(repository);

export class ResourceController {
  /**
   * Criar um novo recurso para um tópico
   */
  static async createResource(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const { url, description, type } = req.body;
      
      if (!url || !description || !type) {
        return res.status(400).json({ message: "URL, description and type are required" });
      }

      const resource = await service.createResource(topicId, { url, description, type });
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  /**
   * Obter todos os recursos de um tópico
   */
  static async getResourcesByTopic(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const resources = await service.getResourcesByTopicId(topicId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  /**
   * Obter um recurso por ID
   */
  static async getResourceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resource = await service.getResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  /**
   * Atualizar um recurso
   */
  static async updateResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedResource = await service.updateResource(id, updates);
      if (!updatedResource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.json(updatedResource);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  /**
   * Deletar um recurso
   */
  static async deleteResource(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await service.deleteResource(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
}
