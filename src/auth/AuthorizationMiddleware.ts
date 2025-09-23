import { Request, Response, NextFunction } from "express";
import { StrategyFactory } from "./StrategyFactory";
import { RoleStrategy } from "./RoleStrategy";

// Estender o tipo Request para incluir user e strategy
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
      strategy?: RoleStrategy;
    }
  }
}

/**
 * Middleware de autorização que usa Strategy pattern
 */
export class AuthorizationMiddleware {
  /**
   * Middleware para verificar se o usuário tem uma permissão específica
   */
  static authorize(permission: keyof RoleStrategy) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Verificar se o usuário está autenticado
        if (!req.user) {
          return res.status(401).json({ message: "Authentication required" });
        }

        // Criar estratégia baseada no role do usuário
        const strategy = StrategyFactory.createStrategy(req.user.role);
        req.strategy = strategy;

        // Verificar se o usuário tem a permissão necessária
        const hasPermission = strategy[permission]();
        
        if (!hasPermission) {
          return res.status(403).json({ 
            message: `Access denied. Required permission: ${permission}`,
            userRole: req.user.role,
            requiredPermission: permission
          });
        }

        next();
      } catch (error) {
        res.status(500).json({ 
          message: "Authorization error", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    };
  }

  /**
   * Middleware para verificar múltiplas permissões (todas devem ser verdadeiras)
   */
  static authorizeAll(permissions: (keyof RoleStrategy)[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const strategy = StrategyFactory.createStrategy(req.user.role);
        req.strategy = strategy;

        const hasAllPermissions = permissions.every(permission => strategy[permission]());
        
        if (!hasAllPermissions) {
          return res.status(403).json({ 
            message: `Access denied. Required permissions: ${permissions.join(", ")}`,
            userRole: req.user.role,
            requiredPermissions: permissions
          });
        }

        next();
      } catch (error) {
        res.status(500).json({ 
          message: "Authorization error", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    };
  }

  /**
   * Middleware para verificar múltiplas permissões (pelo menos uma deve ser verdadeira)
   */
  static authorizeAny(permissions: (keyof RoleStrategy)[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const strategy = StrategyFactory.createStrategy(req.user.role);
        req.strategy = strategy;

        const hasAnyPermission = permissions.some(permission => strategy[permission]());
        
        if (!hasAnyPermission) {
          return res.status(403).json({ 
            message: `Access denied. Required at least one permission: ${permissions.join(", ")}`,
            userRole: req.user.role,
            requiredPermissions: permissions
          });
        }

        next();
      } catch (error) {
        res.status(500).json({ 
          message: "Authorization error", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    };
  }

  /**
   * Middleware para verificar se o usuário é admin
   */
  static requireAdmin(req: Request, res: Response, next: NextFunction) {
    return AuthorizationMiddleware.authorize("canAccessAdminPanel")(req, res, next);
  }

  /**
   * Middleware para verificar se o usuário pode criar conteúdo
   */
  static requireCreatePermission(req: Request, res: Response, next: NextFunction) {
    return AuthorizationMiddleware.authorizeAny(["canCreateTopic", "canCreateResource"])(req, res, next);
  }

  /**
   * Middleware para verificar se o usuário pode editar conteúdo
   */
  static requireEditPermission(req: Request, res: Response, next: NextFunction) {
    return AuthorizationMiddleware.authorizeAny(["canUpdateTopic", "canUpdateResource"])(req, res, next);
  }

  /**
   * Middleware para verificar se o usuário pode deletar conteúdo
   */
  static requireDeletePermission(req: Request, res: Response, next: NextFunction) {
    return AuthorizationMiddleware.authorizeAny(["canDeleteTopic", "canDeleteResource"])(req, res, next);
  }
}
