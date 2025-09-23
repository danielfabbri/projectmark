import { Topic } from "../models/Topic";
import { JsonFileRepository } from "./JsonFileRepository";

export class TopicRepository extends JsonFileRepository<Topic> {
  constructor() {
    super("topics.json");
  }
}
