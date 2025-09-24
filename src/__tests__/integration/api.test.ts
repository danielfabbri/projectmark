import request from 'supertest';
import app from '../../app';
import { TestUtils } from '../utils/TestUtils';

// Mock do JWT para testes de integração
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-jwt-token'),
  verify: jest.fn((token) => {
    if (token === 'mock-jwt-token') {
      return {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'admin'
      };
    }
    throw new Error('Invalid token');
  })
}));

describe('API Integration Tests', () => {
  describe('Authentication', () => {
    describe('POST /auth/login', () => {
      it('should login successfully with valid credentials', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            name: 'Test User'
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('test@example.com');
        expect(response.body.user.name).toBe('Test User');
      });

      it('should return 400 for invalid email', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'invalid-email',
            name: 'Test User'
          })
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });

      it('should return 400 for missing required fields', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'test@example.com'
            // name is missing
          })
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });
    });

    describe('GET /auth/roles', () => {
      it('should return available roles', async () => {
        const response = await request(app)
          .get('/auth/roles')
          .expect(200);

        expect(response.body).toHaveProperty('availableRoles');
        expect(response.body).toHaveProperty('rolesInfo');
        expect(response.body.availableRoles).toContain('admin');
        expect(response.body.availableRoles).toContain('editor');
        expect(response.body.availableRoles).toContain('viewer');
      });
    });

    describe('GET /auth/me', () => {
      it('should return user permissions with valid token', async () => {
        const response = await request(app)
          .get('/auth/me')
          .set('Authorization', 'Bearer mock-jwt-token')
          .expect(200);

        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('role');
        expect(response.body).toHaveProperty('permissions');
        expect(response.body.role).toBe('admin');
      });

      it('should return 401 without token', async () => {
        const response = await request(app)
          .get('/auth/me')
          .expect(401);

        expect(response.body).toHaveProperty('status', 401);
        expect(response.body).toHaveProperty('message', 'No token provided');
      });

      it('should return 401 with invalid token', async () => {
        const response = await request(app)
          .get('/auth/me')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        expect(response.body).toHaveProperty('status', 401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
      });
    });
  });

  describe('Topics', () => {
    const authHeaders = {
      'Authorization': 'Bearer mock-jwt-token',
      'Content-Type': 'application/json'
    };

    describe('POST /topics', () => {
      it('should create a new topic with valid data', async () => {
        const topicData = {
          name: 'Test Topic',
          content: 'Test content'
        };

        const response = await request(app)
          .post('/topics')
          .set(authHeaders)
          .send(topicData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('topicId');
        expect(response.body.name).toBe(topicData.name);
        expect(response.body.content).toBe(topicData.content);
        expect(response.body.version).toBe(1);
      });

      it('should return 400 for invalid topic data', async () => {
        const response = await request(app)
          .post('/topics')
          .set(authHeaders)
          .send({
            name: '', // Invalid: empty name
            content: 'Test content'
          })
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });

      it('should return 401 without authentication', async () => {
        const response = await request(app)
          .post('/topics')
          .send({
            name: 'Test Topic',
            content: 'Test content'
          })
          .expect(401);

        expect(response.body).toHaveProperty('status', 401);
      });
    });

    describe('GET /topics/:topicId', () => {
      it('should return 404 for non-existent topic', async () => {
        const nonExistentId = 'non-existent-id';
        
        const response = await request(app)
          .get(`/topics/${nonExistentId}`)
          .set(authHeaders)
          .expect(404);

        expect(response.body).toHaveProperty('status', 404);
        expect(response.body).toHaveProperty('message', `Topic with id '${nonExistentId}' not found`);
      });

      it('should return 400 for invalid topic ID format', async () => {
        const response = await request(app)
          .get('/topics/invalid-uuid')
          .set(authHeaders)
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });
    });

    describe('PUT /topics/:topicId', () => {
      it('should return 404 for non-existent topic', async () => {
        const nonExistentId = 'non-existent-id';
        
        const response = await request(app)
          .put(`/topics/${nonExistentId}`)
          .set(authHeaders)
          .send({
            content: 'Updated content'
          })
          .expect(404);

        expect(response.body).toHaveProperty('status', 404);
        expect(response.body).toHaveProperty('message', `Topic with id '${nonExistentId}' not found`);
      });
    });

    describe('GET /topics/path', () => {
      it('should return 400 for missing query parameters', async () => {
        const response = await request(app)
          .get('/topics/path')
          .set(authHeaders)
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });

      it('should return 400 for invalid query parameters', async () => {
        const response = await request(app)
          .get('/topics/path?from=invalid&to=invalid')
          .set(authHeaders)
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });
    });
  });

  describe('Resources', () => {
    const authHeaders = {
      'Authorization': 'Bearer mock-jwt-token',
      'Content-Type': 'application/json'
    };

    describe('POST /topics/:topicId/resources', () => {
      it('should return 400 for invalid resource data', async () => {
        const topicId = 'valid-topic-id';
        
        const response = await request(app)
          .post(`/topics/${topicId}/resources`)
          .set(authHeaders)
          .send({
            url: 'invalid-url', // Invalid URL
            description: 'Test resource',
            type: 'link'
          })
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });

      it('should return 400 for invalid resource type', async () => {
        const topicId = 'valid-topic-id';
        
        const response = await request(app)
          .post(`/topics/${topicId}/resources`)
          .set(authHeaders)
          .send({
            url: 'https://example.com',
            description: 'Test resource',
            type: 'invalid-type'
          })
          .expect(400);

        expect(response.body).toHaveProperty('status', 400);
        expect(response.body).toHaveProperty('message', 'Validation failed');
      });
    });

    describe('GET /resources/:id', () => {
      it('should return 404 for non-existent resource', async () => {
        const nonExistentId = 'non-existent-id';
        
        const response = await request(app)
          .get(`/resources/${nonExistentId}`)
          .set(authHeaders)
          .expect(404);

        expect(response.body).toHaveProperty('status', 404);
        expect(response.body).toHaveProperty('message', `Resource with id '${nonExistentId}' not found`);
      });
    });
  });

  describe('Authorization', () => {
    // Mock para usuário viewer (sem permissões de escrita)
    jest.mock('jsonwebtoken', () => ({
      sign: jest.fn(() => 'mock-jwt-token'),
      verify: jest.fn((token) => {
        if (token === 'mock-jwt-token') {
          return {
            userId: 'test-user-id',
            email: 'test@example.com',
            role: 'viewer' // Usuário com permissões limitadas
          };
        }
        throw new Error('Invalid token');
      })
    }));

    it('should return 403 for viewer trying to create topic', async () => {
      const response = await request(app)
        .post('/topics')
        .set({
          'Authorization': 'Bearer mock-jwt-token',
          'Content-Type': 'application/json'
        })
        .send({
          name: 'Test Topic',
          content: 'Test content'
        })
        .expect(403);

      expect(response.body).toHaveProperty('status', 403);
      expect(response.body).toHaveProperty('message', 'Access denied. Required permission: canCreateTopic');
    });

    it('should return 403 for viewer trying to update topic', async () => {
      const response = await request(app)
        .put('/topics/some-topic-id')
        .set({
          'Authorization': 'Bearer mock-jwt-token',
          'Content-Type': 'application/json'
        })
        .send({
          content: 'Updated content'
        })
        .expect(403);

      expect(response.body).toHaveProperty('status', 403);
      expect(response.body).toHaveProperty('message', 'Access denied. Required permission: canUpdateTopic');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('status', 404);
      expect(response.body).toHaveProperty('message', 'Route GET /non-existent-route not found');
    });

    it('should return 400 for malformed JSON', async () => {
      const response = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('status', 400);
      expect(response.body).toHaveProperty('message', 'Invalid JSON format');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('API Documentation', () => {
    it('should return API information at root', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'ProjectMark API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
