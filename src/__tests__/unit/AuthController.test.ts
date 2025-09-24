import { AuthController } from '../../controllers/AuthController';
import { UserService } from '../../services/UserService';
import { MockUserRepository } from '../mocks/MockRepositories';
import { TestUtils } from '../utils/TestUtils';
import { AuthenticationError } from '../../errors/AppError';
import jwt from 'jsonwebtoken';

// Mock do JWT
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthController', () => {
  let mockRepository: MockUserRepository;
  let userService: UserService;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    userService = new UserService(mockRepository);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockRepository.clear();
  });

  describe('login', () => {
    it('should login existing user and return token', async () => {
      const existingUser = TestUtils.createMockUser({
        email: 'test@example.com',
        name: 'Test User',
        role: 'editor'
      });
      mockRepository.addUser(existingUser);

      const mockToken = 'mock-jwt-token';
      (mockedJwt.sign as jest.Mock).mockReturnValue(mockToken);

      const req = {
        body: {
          email: 'test@example.com',
          name: 'Test User'
        }
      } as any;

      const res = {
        json: jest.fn()
      } as any;

      await AuthController.login(req, res);

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        {
          userId: existingUser.id,
          email: existingUser.email,
          role: existingUser.role
        },
        'test-secret-key',
        { expiresIn: '24h' }
      );

      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role
        }
      });
    });

    it('should create new user if not exists', async () => {
      const mockToken = 'mock-jwt-token';
      (mockedJwt.sign as jest.Mock).mockReturnValue(mockToken);

      const req = {
        body: {
          email: 'newuser@example.com',
          name: 'New User'
        }
      } as any;

      const res = {
        json: jest.fn()
      } as any;

      await AuthController.login(req, res);

      const users = mockRepository.getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('newuser@example.com');
      expect(users[0].name).toBe('New User');
      expect(users[0].role).toBe('viewer'); // Role padrão

      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        user: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          role: users[0].role
        }
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token and set user in request', async () => {
      const mockUser = TestUtils.createMockUser();
      const mockToken = 'valid-token';
      
      mockedJwt.verify.mockReturnValue({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      } as any);

      const req = {
        headers: {
          authorization: `Bearer ${mockToken}`
        },
        user: undefined
      } as any;

      const res = {} as any;
      const next = jest.fn();

      await AuthController.verifyToken(req, res, next);

      expect(mockedJwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key');
      expect(req.user).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });
      expect(next).toHaveBeenCalled();
    });

    it('should throw error when no token provided', async () => {
      const req = {
        headers: {}
      } as any;

      const res = {} as any;
      const next = jest.fn();

      await expect(AuthController.verifyToken(req, res, next))
        .rejects
        .toThrow(AuthenticationError);
    });

    it('should throw error when token is invalid', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      } as any;

      const res = {} as any;
      const next = jest.fn();

      await expect(AuthController.verifyToken(req, res, next))
        .rejects
        .toThrow(AuthenticationError);
    });
  });

  describe('getRolesInfo', () => {
    it('should return information about available roles', async () => {
      const req = {} as any;
      const res = {
        json: jest.fn()
      } as any;

      await AuthController.getRolesInfo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        availableRoles: ['admin', 'editor', 'viewer'],
        rolesInfo: expect.arrayContaining([
          expect.objectContaining({
            role: 'admin',
            permissions: expect.objectContaining({
              canCreateTopic: true,
              canUpdateTopic: true,
              canDeleteTopic: true,
              canViewTopic: true,
              canAccessAdminPanel: true
            })
          }),
          expect.objectContaining({
            role: 'editor',
            permissions: expect.objectContaining({
              canCreateTopic: true,
              canUpdateTopic: true,
              canDeleteTopic: true,
              canViewTopic: true,
              canAccessAdminPanel: false
            })
          }),
          expect.objectContaining({
            role: 'viewer',
            permissions: expect.objectContaining({
              canCreateTopic: false,
              canUpdateTopic: false,
              canDeleteTopic: false,
              canViewTopic: true,
              canAccessAdminPanel: false
            })
          })
        ])
      });
    });
  });

  describe('getCurrentUserPermissions', () => {
    it('should return current user permissions', async () => {
      const mockUser = {
        userId: 'user-id',
        email: 'test@example.com',
        role: 'editor'
      };

      const req = {
        user: mockUser
      } as any;

      const res = {
        json: jest.fn()
      } as any;

      await AuthController.getCurrentUserPermissions(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
        role: 'editor',
        permissions: expect.objectContaining({
          canCreateTopic: true,
          canUpdateTopic: true,
          canDeleteTopic: true,
          canViewTopic: true,
          canAccessAdminPanel: false
        })
      });
    });

    it('should throw error when user is not authenticated', async () => {
      const req = {
        user: undefined
      } as any;

      const res = {
        json: jest.fn()
      } as any;

      await expect(AuthController.getCurrentUserPermissions(req, res))
        .rejects
        .toThrow(AuthenticationError);
    });
  });
});
