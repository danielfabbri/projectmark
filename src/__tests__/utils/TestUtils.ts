import { v4 as uuidv4 } from 'uuid';
import { ITopic } from '../../models/types/ITopic';
import { IResource } from '../../models/types/IResource';
import { IUser } from '../../models/types/IUser';
import { Topic } from '../../models/Topic';
import { Resource } from '../../models/Resource';
import { User } from '../../models/User';

export class TestUtils {
  /**
   * Cria um tópico mock para testes
   */
  static createMockTopic(overrides: Partial<ITopic> = {}): Topic {
    const topicData = {
      id: uuidv4(),
      topicId: uuidv4(),
      name: 'Test Topic',
      content: 'Test content',
      version: 1,
      parentTopicId: undefined,
      ...overrides
    };
    return new Topic(topicData);
  }

  /**
   * Cria um recurso mock para testes
   */
  static createMockResource(overrides: Partial<IResource> = {}): Resource {
    const resourceData = {
      id: uuidv4(),
      topicId: uuidv4(),
      url: 'https://example.com',
      description: 'Test resource',
      type: 'link',
      ...overrides
    };
    return new Resource(resourceData);
  }

  /**
   * Cria um usuário mock para testes
   */
  static createMockUser(overrides: Partial<IUser> = {}): User {
    const userData = {
      id: uuidv4(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'viewer' as const,
      ...overrides
    };
    return new User(userData);
  }

  /**
   * Cria um token JWT mock para testes
   */
  static createMockJwtToken(user: Partial<IUser> = {}): string {
    const mockUser = this.createMockUser(user);
    return `Bearer mock-token-${mockUser.id}`;
  }

  /**
   * Cria headers de autenticação para testes
   */
  static createAuthHeaders(user: Partial<IUser> = {}): Record<string, string> {
    return {
      'Authorization': this.createMockJwtToken(user),
      'Content-Type': 'application/json'
    };
  }

  /**
   * Aguarda um tempo específico (útil para testes assíncronos)
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cria um array de tópicos mock para testes
   */
  static createMockTopics(count: number, baseTopicId?: string): Topic[] {
    return Array.from({ length: count }, (_, index) => 
      this.createMockTopic({
        topicId: baseTopicId || uuidv4(),
        version: index + 1,
        name: `Test Topic ${index + 1}`,
        content: `Test content ${index + 1}`
      })
    );
  }
}
