import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthorizationMiddleware } from "../auth/AuthorizationMiddleware";
import { ValidationMiddleware } from "../middleware/ValidationMiddleware";
import { LoginDto } from "../dtos/LoginDto";

const router = Router();

// Rotas de autenticação com validação
router.post("/login", 
  ValidationMiddleware.validate(LoginDto),
  AuthController.login
); // POST /auth/login

router.get("/roles", AuthController.getRolesInfo); // GET /auth/roles - informações sobre roles

router.get("/me", 
  AuthController.verifyToken, 
  AuthController.getCurrentUserPermissions
); // GET /auth/me - permissões do usuário atual

export default router;
