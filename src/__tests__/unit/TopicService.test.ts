import { TopicService } from '../../services/TopicService';
import { TopicFactory } from '../../models/TopicFactory';
import { MockTopicRepository } from '../mocks/MockRepositories';
import { TestUtils } from '../utils/TestUtils';
import { NotFoundError } from '../../errors/AppError';

describe('TopicService', () => {
  let topicService: TopicService;
  let mockRepository: MockTopicRepository;
  let topicFactory: TopicFactory;

  beforeEach(() => {
    mockRepository = new MockTopicRepository();
    topicFactory = new TopicFactory();
    topicService = new TopicService(mockRepository, topicFactory);
  });

  afterEach(() => {
    mockRepository.clear();
  });

  describe('createTopic', () => {
    it('should create a new topic with version 1', async () => {
      const topicData = {
        name: 'Test Topic',
        content: 'Test content',
        parentTopicId: undefined
      };

      const result = await topicService.createTopic(topicData);

      expect(result).toBeDefined();
      expect(result.name).toBe(topicData.name);
      expect(result.content).toBe(topicData.content);
      expect(result.version).toBe(1);
      expect(result.topicId).toBeDefined();
      expect(result.id).toBeDefined();

      const savedTopics = mockRepository.getTopics();
      expect(savedTopics).toHaveLength(1);
      expect(savedTopics[0].id).toBe(result.id);
    });

    it('should create a topic with parent topic ID', async () => {
      const parentTopic = TestUtils.createMockTopic();
      mockRepository.addTopic(parentTopic);

      const topicData = {
        name: 'Child Topic',
        content: 'Child content',
        parentTopicId: parentTopic.topicId
      };

      const result = await topicService.createTopic(topicData);

      expect(result.parentTopicId).toBe(parentTopic.topicId);
    });
  });

  describe('updateTopic', () => {
    it('should create a new version when updating a topic', async () => {
      const originalTopic = TestUtils.createMockTopic({
        name: 'Original Topic',
        content: 'Original content',
        version: 1
      });
      mockRepository.addTopic(originalTopic);

      const changes = {
        content: 'Updated content'
      };

      const result = await topicService.updateTopic(originalTopic.topicId, changes);

      expect(result).toBeDefined();
      expect(result.topicId).toBe(originalTopic.topicId);
      expect(result.version).toBe(2);
      expect(result.content).toBe('Updated content');
      expect(result.name).toBe(originalTopic.name);

      const savedTopics = mockRepository.getTopics();
      expect(savedTopics).toHaveLength(2);
    });

    it('should return null when topic does not exist', async () => {
      const nonExistentTopicId = 'non-existent-id';
      const changes = { content: 'Updated content' };

      const result = await topicService.updateTopic(nonExistentTopicId, changes);

      expect(result).toBeNull();
    });

    it('should update name and parentTopicId', async () => {
      const originalTopic = TestUtils.createMockTopic({
        name: 'Original Topic',
        content: 'Original content',
        version: 1
      });
      mockRepository.addTopic(originalTopic);

      const changes = {
        name: 'Updated Topic',
        parentTopicId: 'new-parent-id'
      };

      const result = await topicService.updateTopic(originalTopic.topicId, changes);

      expect(result.name).toBe('Updated Topic');
      expect(result.parentTopicId).toBe('new-parent-id');
      expect(result.content).toBe(originalTopic.content);
    });
  });

  describe('getLatestTopic', () => {
    it('should return the latest version of a topic', async () => {
      const topicId = 'test-topic-id';
      const topics = TestUtils.createMockTopics(3, topicId);
      topics.forEach(topic => mockRepository.addTopic(topic));

      const result = await topicService.getLatestTopic(topicId);

      expect(result).toBeDefined();
      expect(result.topicId).toBe(topicId);
      expect(result.version).toBe(3);
    });

    it('should return null when topic does not exist', async () => {
      const nonExistentTopicId = 'non-existent-id';

      const result = await topicService.getLatestTopic(nonExistentTopicId);

      expect(result).toBeNull();
    });
  });

  describe('getTopicVersion', () => {
    it('should return a specific version of a topic', async () => {
      const topicId = 'test-topic-id';
      const topics = TestUtils.createMockTopics(3, topicId);
      topics.forEach(topic => mockRepository.addTopic(topic));

      const result = await topicService.getTopicVersion(topicId, 2);

      expect(result).toBeDefined();
      expect(result.topicId).toBe(topicId);
      expect(result.version).toBe(2);
    });

    it('should return null when version does not exist', async () => {
      const topicId = 'test-topic-id';
      const topics = TestUtils.createMockTopics(2, topicId);
      topics.forEach(topic => mockRepository.addTopic(topic));

      const result = await topicService.getTopicVersion(topicId, 5);

      expect(result).toBeNull();
    });
  });

  describe('getTopicTree', () => {
    it('should return a tree structure with children', async () => {
      const rootTopic = TestUtils.createMockTopic({
        topicId: 'root-topic',
        name: 'Root Topic'
      });
      mockRepository.addTopic(rootTopic);

      const childTopic1 = TestUtils.createMockTopic({
        topicId: 'child-topic-1',
        name: 'Child Topic 1',
        parentTopicId: 'root-topic'
      });
      mockRepository.addTopic(childTopic1);

      const childTopic2 = TestUtils.createMockTopic({
        topicId: 'child-topic-2',
        name: 'Child Topic 2',
        parentTopicId: 'root-topic'
      });
      mockRepository.addTopic(childTopic2);

      const result = await topicService.getTopicTree('root-topic');

      expect(result).toBeDefined();
      expect(result.topicId).toBe('root-topic');
      expect(result.children).toHaveLength(2);
      expect(result.children[0].topicId).toBe('child-topic-1');
      expect(result.children[1].topicId).toBe('child-topic-2');
    });

    it('should return null when root topic does not exist', async () => {
      const result = await topicService.getTopicTree('non-existent-topic');

      expect(result).toBeNull();
    });

    it('should use latest versions for children', async () => {
      const rootTopic = TestUtils.createMockTopic({
        topicId: 'root-topic',
        name: 'Root Topic'
      });
      mockRepository.addTopic(rootTopic);

      // Adicionar múltiplas versões do mesmo filho
      const childV1 = TestUtils.createMockTopic({
        topicId: 'child-topic',
        name: 'Child Topic V1',
        parentTopicId: 'root-topic',
        version: 1
      });
      const childV2 = TestUtils.createMockTopic({
        topicId: 'child-topic',
        name: 'Child Topic V2',
        parentTopicId: 'root-topic',
        version: 2
      });

      mockRepository.addTopic(childV1);
      mockRepository.addTopic(childV2);

      const result = await topicService.getTopicTree('root-topic');

      expect(result.children).toHaveLength(1);
      expect(result.children[0].version).toBe(2);
      expect(result.children[0].name).toBe('Child Topic V2');
    });
  });

  describe('findShortestPath', () => {
    it('should find shortest path between two topics', async () => {
      // Criar uma estrutura: A -> B -> C
      const topicA = TestUtils.createMockTopic({
        topicId: 'topic-a',
        name: 'Topic A'
      });
      const topicB = TestUtils.createMockTopic({
        topicId: 'topic-b',
        name: 'Topic B',
        parentTopicId: 'topic-a'
      });
      const topicC = TestUtils.createMockTopic({
        topicId: 'topic-c',
        name: 'Topic C',
        parentTopicId: 'topic-b'
      });

      mockRepository.addTopic(topicA);
      mockRepository.addTopic(topicB);
      mockRepository.addTopic(topicC);

      const result = await topicService.findShortestPath('topic-a', 'topic-c');

      expect(result).toEqual(['topic-a', 'topic-b', 'topic-c']);
    });

    it('should return null when path does not exist', async () => {
      const topicA = TestUtils.createMockTopic({ topicId: 'topic-a' });
      const topicB = TestUtils.createMockTopic({ topicId: 'topic-b' });

      mockRepository.addTopic(topicA);
      mockRepository.addTopic(topicB);

      const result = await topicService.findShortestPath('topic-a', 'topic-b');

      expect(result).toBeNull();
    });

    it('should return null when source topic does not exist', async () => {
      const topicB = TestUtils.createMockTopic({ topicId: 'topic-b' });
      mockRepository.addTopic(topicB);

      const result = await topicService.findShortestPath('non-existent', 'topic-b');

      expect(result).toBeNull();
    });

    it('should return null when destination topic does not exist', async () => {
      const topicA = TestUtils.createMockTopic({ topicId: 'topic-a' });
      mockRepository.addTopic(topicA);

      const result = await topicService.findShortestPath('topic-a', 'non-existent');

      expect(result).toBeNull();
    });

    it('should find direct path when topics are directly connected', async () => {
      const topicA = TestUtils.createMockTopic({ topicId: 'topic-a' });
      const topicB = TestUtils.createMockTopic({
        topicId: 'topic-b',
        parentTopicId: 'topic-a'
      });

      mockRepository.addTopic(topicA);
      mockRepository.addTopic(topicB);

      const result = await topicService.findShortestPath('topic-a', 'topic-b');

      expect(result).toEqual(['topic-a', 'topic-b']);
    });
  });
});
