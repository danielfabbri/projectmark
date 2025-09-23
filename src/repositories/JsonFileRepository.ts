import fs from "fs";
import path from "path";
import { IRepository } from "./IRepository";

export class JsonFileRepository<T extends { id: string }> implements IRepository<T> {
  private filePath: string;
  private items: T[] = [];

  constructor(filename: string) {
    this.filePath = path.resolve(__dirname, `../../data/${filename}`);
    this.load();
  }

  private load(): void {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf-8");
      this.items = JSON.parse(data) as T[];
    } else {
      this.items = [];
      fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2));
    }
  }

  private persist(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2));
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async save(entity: T): Promise<void> {
    this.items.push(entity);
    this.persist();
  }

  async update(entity: T): Promise<void> {
    const index = this.items.findIndex(item => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
      this.persist();
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
    this.persist();
  }
}
