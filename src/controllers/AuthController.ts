import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { StrategyFactory } from "../auth/StrategyFactory";
import { LoginDto } from "../dtos/LoginDto";
import { AuthenticationError } from "../errors/AppError";
import jwt from "jsonwebtoken";

// Inicializar dependências
const repository = new UserRepository();
const userService = new UserService(repository);

// Chave secreta para JWT (em produção, usar variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthController {
  /**
   * Login do usuário
   */
  static async login(req: Request, res: Response) {
    const loginDto = req.body as LoginDto;

    // Buscar usuário por email
    let user = await userService.getUserByEmail(loginDto.email);
    
    // Se não existir, criar novo usuário
    if (!user) {
      user = await userService.createUser({
        name: loginDto.name,
        email: loginDto.email,
        role: "viewer", // Role padrão
      });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  /**
   * Verificar token JWT (middleware)
   */
  static verifyToken(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      throw new AuthenticationError("No token provided");
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (error) {
      throw new AuthenticationError("Invalid token");
    }
  }

  /**
   * Middleware para verificar se usuário é admin
   */
  static requireAdmin(req: Request, res: Response, next: Function) {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  }

  /**
   * Middleware para verificar se usuário é editor ou admin
   */
  static requireEditor(req: Request, res: Response, next: Function) {
    if (!["admin", "editor"].includes(req.user?.role)) {
      return res.status(403).json({ message: "Editor access required" });
    }
    next();
  }

  /**
   * Obter informações sobre roles e permissões
   */
  static getRolesInfo(req: Request, res: Response) {
    try {
      const roles = StrategyFactory.getAvailableRoles();
      const rolesInfo = roles.map(role => {
        const strategy = StrategyFactory.createStrategy(role);
        return {
          role,
          permissions: {
            canCreateTopic: strategy.canCreateTopic(),
            canUpdateTopic: strategy.canUpdateTopic(),
            canDeleteTopic: strategy.canDeleteTopic(),
            canViewTopic: strategy.canViewTopic(),
            canViewTopicHistory: strategy.canViewTopicHistory(),
            canCreateResource: strategy.canCreateResource(),
            canUpdateResource: strategy.canUpdateResource(),
            canDeleteResource: strategy.canDeleteResource(),
            canViewResource: strategy.canViewResource(),
            canCreateUser: strategy.canCreateUser(),
            canUpdateUser: strategy.canUpdateUser(),
            canDeleteUser: strategy.canDeleteUser(),
            canViewUsers: strategy.canViewUsers(),
            canAccessAdminPanel: strategy.canAccessAdminPanel(),
            canManageSystem: strategy.canManageSystem(),
          }
        };
      });

      res.json({
        availableRoles: roles,
        rolesInfo
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  /**
   * Obter permissões do usuário atual
   */
  static getCurrentUserPermissions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const strategy = StrategyFactory.createStrategy(req.user.role);
      
      res.json({
        user: req.user,
        role: req.user.role,
        permissions: {
          canCreateTopic: strategy.canCreateTopic(),
          canUpdateTopic: strategy.canUpdateTopic(),
          canDeleteTopic: strategy.canDeleteTopic(),
          canViewTopic: strategy.canViewTopic(),
          canViewTopicHistory: strategy.canViewTopicHistory(),
          canCreateResource: strategy.canCreateResource(),
          canUpdateResource: strategy.canUpdateResource(),
          canDeleteResource: strategy.canDeleteResource(),
          canViewResource: strategy.canViewResource(),
          canCreateUser: strategy.canCreateUser(),
          canUpdateUser: strategy.canUpdateUser(),
          canDeleteUser: strategy.canDeleteUser(),
          canViewUsers: strategy.canViewUsers(),
          canAccessAdminPanel: strategy.canAccessAdminPanel(),
          canManageSystem: strategy.canManageSystem(),
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
}
