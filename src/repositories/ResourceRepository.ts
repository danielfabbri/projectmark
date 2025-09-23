import { Resource } from "../models/Resource";
import { JsonFileRepository } from "./JsonFileRepository";

export class ResourceRepository extends JsonFileRepository<Resource> {
  constructor() {
    super("resources.json");
  }
}
