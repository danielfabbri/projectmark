import { Request, Response } from "express";
import { TopicService } from "../services/TopicService";
import { TopicFactory } from "../models/TopicFactory";

const service = new TopicService();
const factory = new TopicFactory();

export class TopicController {
  static async findAll(req: Request, res: Response) {
    const topics = await service.getAll();
    res.json(topics);
  }

  static async findById(req: Request, res: Response) {
    const topic = await service.getById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Not found" });
    res.json(topic);
  }

  static async create(req: Request, res: Response) {
    const { name, content } = req.body;
    const topic = factory.createNew(name, content);
    await service.create(topic);
    res.status(201).json(topic);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { content } = req.body;
    const oldTopic = await service.getById(id);
    if (!oldTopic) return res.status(404).json({ message: "Not found" });

    oldTopic.content = content;
    oldTopic.touch();

    await service.update(oldTopic);
    res.json(oldTopic);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await service.delete(id);
    res.status(204).send();
  }
}
