import { IRepository } from "./IRepository";

export class InMemoryRepository<T extends { id: string }> implements IRepository<T> {
  private items: T[] = [];

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async save(entity: T): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: T): Promise<void> {
    const index = this.items.findIndex(item => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}