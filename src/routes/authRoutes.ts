import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// Rotas de autenticação conforme especificação
router.post("/login", AuthController.login); // POST /auth/login

export default router;
