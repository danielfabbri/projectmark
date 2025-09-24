import { ITopic } from '../../models/types/ITopic';
import { IResource } from '../../models/types/IResource';
import { IUser } from '../../models/types/IUser';
import { Topic } from '../../models/Topic';
import { Resource } from '../../models/Resource';
import { User } from '../../models/User';
import { IRepository } from '../../repositories/IRepository';

export class MockTopicRepository implements IRepository<Topic> {
  private topics: Topic[] = [];

  async findAll(): Promise<Topic[]> {
    return [...this.topics];
  }

  async findById(id: string): Promise<Topic | null> {
    return this.topics.find(topic => topic.id === id) || null;
  }

  async save(entity: Topic): Promise<void> {
    this.topics.push(entity);
  }

  async update(entity: Topic): Promise<void> {
    const index = this.topics.findIndex(topic => topic.id === entity.id);
    if (index !== -1) {
      this.topics[index] = entity;
    }
  }

  async delete(id: string): Promise<void> {
    this.topics = this.topics.filter(topic => topic.id !== id);
  }

  // Métodos auxiliares para testes
  clear(): void {
    this.topics = [];
  }

  addTopic(topic: Topic): void {
    this.topics.push(topic);
  }

  getTopics(): Topic[] {
    return [...this.topics];
  }
}

export class MockResourceRepository implements IRepository<Resource> {
  private resources: Resource[] = [];

  async findAll(): Promise<Resource[]> {
    return [...this.resources];
  }

  async findById(id: string): Promise<Resource | null> {
    return this.resources.find(resource => resource.id === id) || null;
  }

  async save(entity: Resource): Promise<void> {
    this.resources.push(entity);
  }

  async update(entity: Resource): Promise<void> {
    const index = this.resources.findIndex(resource => resource.id === entity.id);
    if (index !== -1) {
      this.resources[index] = entity;
    }
  }

  async delete(id: string): Promise<void> {
    this.resources = this.resources.filter(resource => resource.id !== id);
  }

  // Métodos auxiliares para testes
  clear(): void {
    this.resources = [];
  }

  addResource(resource: Resource): void {
    this.resources.push(resource);
  }

  getResources(): Resource[] {
    return [...this.resources];
  }
}

export class MockUserRepository implements IRepository<User> {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async save(entity: User): Promise<void> {
    this.users.push(entity);
  }

  async update(entity: User): Promise<void> {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index !== -1) {
      this.users[index] = entity;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  // Métodos auxiliares para testes
  clear(): void {
    this.users = [];
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  getUsers(): User[] {
    return [...this.users];
  }
}
