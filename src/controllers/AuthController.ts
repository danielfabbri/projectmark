import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
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
    try {
      const { email, name } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required" });
      }

      // Buscar usuário por email
      let user = await userService.getUserByEmail(email);
      
      // Se não existir, criar novo usuário
      if (!user) {
        user = await userService.createUser({
          name,
          email,
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
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  /**
   * Verificar token JWT (middleware)
   */
  static verifyToken(req: Request, res: Response, next: Function) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
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
}
