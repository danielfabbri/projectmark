import { User } from "../models/User";
import { JsonFileRepository } from "./JsonFileRepository";

export class UserRepository extends JsonFileRepository<User> {
  constructor() {
    super("users.json");
  }
}
