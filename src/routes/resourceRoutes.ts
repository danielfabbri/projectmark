import { Router } from "express";
import { ResourceController } from "../controllers/ResourceController";
import { AuthController } from "../controllers/AuthController";
import { AuthorizationMiddleware } from "../auth/AuthorizationMiddleware";
import { ValidationMiddleware } from "../middleware/ValidationMiddleware";
import { CreateResourceDto } from "../dtos/CreateResourceDto";
import { UpdateResourceDto } from "../dtos/UpdateResourceDto";
import { ResourceParamsDto, TopicResourceParamsDto } from "../dtos/TopicParamsDto";

const router = Router();

// Rotas para recursos conforme especificação com autorização e validação
router.post("/:topicId/resources", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canCreateResource"),
  ValidationMiddleware.validateParams(TopicResourceParamsDto),
  ValidationMiddleware.validate(CreateResourceDto),
  ResourceController.createResource
); // POST /topics/:topicId/resources

router.get("/:topicId/resources", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canViewResource"),
  ValidationMiddleware.validateParams(TopicResourceParamsDto),
  ResourceController.getResourcesByTopic
); // GET /topics/:topicId/resources

router.get("/resources/:id", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canViewResource"),
  ValidationMiddleware.validateParams(ResourceParamsDto),
  ResourceController.getResourceById
); // GET /resources/:id

router.put("/resources/:id", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canUpdateResource"),
  ValidationMiddleware.validateParams(ResourceParamsDto),
  ValidationMiddleware.validate(UpdateResourceDto),
  ResourceController.updateResource
); // PUT /resources/:id

router.delete("/resources/:id", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canDeleteResource"),
  ValidationMiddleware.validateParams(ResourceParamsDto),
  ResourceController.deleteResource
); // DELETE /resources/:id

export default router;
