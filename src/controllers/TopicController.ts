import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";
import { TopicFactory } from "../models/TopicFactory";
import { TopicRepository } from "../repositories/TopicRepository";
import { CreateTopicDto } from "../dtos/CreateTopicDto";
import { UpdateTopicDto } from "../dtos/UpdateTopicDto";
import { NotFoundError, ValidationError } from "../errors/AppError";

// Inicializar dependências
const repository = new TopicRepository();
const factory = new TopicFactory();
const service = new TopicService(repository, factory);

export class TopicController {
    
  static async createTopic(req: Request, res: Response) {
    const logger = (req as any).logger || console;
  
    try {
      const { name, content, parentTopicId } = req.body || {};
      logger.info("create_topic_request_received", { bodyPreview: { name, contentLength: (content || "").length } });
  
      const createTopicDto = req.body as CreateTopicDto;
      const topic = await service.createTopic(createTopicDto);
  
      logger.info("create_topic_request_success", { topicId: topic.topicId, id: topic.id });
      res.status(201).json(topic);
  
    } catch (err: any) {
      // log seguro
      const errorMessage = err?.message || "Unknown error";
      const errorStack = err?.stack || "";
      logger.error("create_topic_request_failed", { error: errorMessage, stack: errorStack });
  
      // retorno estruturado
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        details: { error: errorMessage },
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }
  }

  static async updateTopic(req: Request, res: Response) {
    const { topicId } = req.params;
    const updateTopicDto = req.body as UpdateTopicDto;

    const updatedTopic = await service.updateTopic(topicId, updateTopicDto);
    if (!updatedTopic) {
      throw new NotFoundError("Topic", topicId);
    }

    res.json(updatedTopic);
  }
  
  static async getLatestTopic(req: Request, res: Response) {
    const { topicId } = req.params;
    const topic = await service.getLatestTopic(topicId);
    
    if (!topic) {
      throw new NotFoundError("Topic", topicId);
    }

    res.json(topic);
  }

  static async getTopicVersion(req: Request, res: Response) {
    const { topicId, version } = req.params;
    const versionNumber = parseInt(version);
    
    if (isNaN(versionNumber)) {
      throw new ValidationError("Invalid version number");
    }

    const topic = await service.getTopicVersion(topicId, versionNumber);
    if (!topic) {
      throw new NotFoundError("Topic version", `${topicId}:${version}`);
    }

    res.json(topic);
  }

  static async getTopicTree(req: Request, res: Response) {
    const { topicId } = req.params;
    const tree = await service.getTopicTree(topicId);
    
    if (!tree) {
      throw new NotFoundError("Topic", topicId);
    }

    res.json(tree);
  }
  
  static async findShortestPath(req: Request, res: Response) {
    const { from, to } = req.query;
    
    if (!from || !to) {
      throw new ValidationError("Query parameters 'from' and 'to' are required");
    }

    const path = await service.findShortestPath(from as string, to as string);
    
    if (!path) {
      throw new NotFoundError("Path", `from ${from} to ${to}`);
    }

    res.json(path); // Retorna array de topicIds diretamente
  }
}
