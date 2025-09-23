import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";
import { TopicFactory } from "../models/TopicFactory";
import { TopicRepository } from "../repositories/TopicRepository";

// Inicializar dependências
const repository = new TopicRepository();
const factory = new TopicFactory();
const service = new TopicService(repository, factory);

export class TopicController {
    
  static async createTopic(req: Request, res: Response) {
    try {
      const { name, content, parentTopicId } = req.body;
      
      if (!name || !content) {
        return res.status(400).json({ message: "Name and content are required" });
      }

      const topic = await service.createTopic({ name, content, parentTopicId });
      res.status(201).json(topic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  static async updateTopic(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const changes = req.body;

      const updatedTopic = await service.updateTopic(topicId, changes);
      if (!updatedTopic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json(updatedTopic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
  
  static async getLatestTopic(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const topic = await service.getLatestTopic(topicId);
      
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  static async getTopicVersion(req: Request, res: Response) {
    try {
      const { topicId, version } = req.params;
      const versionNumber = parseInt(version);
      
      if (isNaN(versionNumber)) {
        return res.status(400).json({ message: "Invalid version number" });
      }

      const topic = await service.getTopicVersion(topicId, versionNumber);
      if (!topic) {
        return res.status(404).json({ message: "Topic version not found" });
      }

      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  static async getTopicTree(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const tree = await service.getTopicTree(topicId);
      
      if (!tree) {
        return res.status(404).json({ message: "Topic not found" });
      }

      res.json(tree);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
  
  static async findShortestPath(req: Request, res: Response) {
    try {
      const { from, to } = req.query;
      
      if (!from || !to) {
        return res.status(400).json({ message: "Query parameters 'from' and 'to' are required" });
      }

      const path = await service.findShortestPath(from as string, to as string);
      
      if (!path) {
        return res.status(404).json({ message: "Path not found or topics don't exist" });
      }

      res.json(path); // Retorna array de topicIds diretamente
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
}
