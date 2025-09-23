import { TopicRepository } from "../repositories/TopicRepository";
import { Topic } from "../models/Topic";

export class TopicService {
  private repo = new TopicRepository();

  async getAll(): Promise<Topic[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<Topic | null> {
    return this.repo.findById(id);
  }

  async create(topic: Topic): Promise<void> {
    return this.repo.save(topic);
  }

  async update(topic: Topic): Promise<void> {
    return this.repo.update(topic);
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
