import { Router } from "express";
import { TopicController } from "../controllers/TopicController";
import { AuthController } from "../controllers/AuthController";
import { AuthorizationMiddleware } from "../auth/AuthorizationMiddleware";
import { ValidationMiddleware } from "../middleware/ValidationMiddleware";
import { CreateTopicDto } from "../dtos/CreateTopicDto";
import { UpdateTopicDto } from "../dtos/UpdateTopicDto";
import { TopicParamsDto, TopicVersionParamsDto } from "../dtos/TopicParamsDto";
import { PathQueryDto } from "../dtos/PathQueryDto";

const router = Router();

// Rotas para tópicos conforme especificação com autorização e validação
router.post("/", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canCreateTopic"),
  ValidationMiddleware.validate(CreateTopicDto),
  TopicController.createTopic
); // POST /topics — criar tópico

router.put("/:topicId", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canUpdateTopic"),
  ValidationMiddleware.validateParams(TopicParamsDto),
  ValidationMiddleware.validate(UpdateTopicDto),
  TopicController.updateTopic
); // PUT /topics/:topicId — atualizar (gera nova versão)

router.get("/:topicId", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canViewTopic"),
  ValidationMiddleware.validateParams(TopicParamsDto),
  TopicController.getLatestTopic
); // GET /topics/:topicId — pega versão mais recente

router.get("/:topicId/versions/:version", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canViewTopicHistory"),
  ValidationMiddleware.validateParams(TopicVersionParamsDto),
  TopicController.getTopicVersion
); // GET /topics/:topicId/versions/:version — pega versão específica

router.get("/:topicId/tree", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canViewTopic"),
  ValidationMiddleware.validateParams(TopicParamsDto),
  TopicController.getTopicTree
); // GET /topics/:topicId/tree — pega árvore recursiva

router.get("/path", 
  AuthController.verifyToken, 
  AuthorizationMiddleware.authorize("canViewTopic"),
  ValidationMiddleware.validateQuery(PathQueryDto),
  TopicController.findShortestPath
); // GET /topics/path?from=<id>&to=<id> — menor caminho

export default router;
