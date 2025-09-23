import { Router } from "express";
import { TopicController } from "../controllers/TopicController";

const router = Router();

// Rotas para tópicos conforme especificação
router.post("/", TopicController.createTopic);                    // POST /topics — criar tópico
router.put("/:topicId", TopicController.updateTopic);            // PUT /topics/:topicId — atualizar (gera nova versão)
router.get("/:topicId", TopicController.getLatestTopic);        // GET /topics/:topicId — pega versão mais recente
router.get("/:topicId/versions/:version", TopicController.getTopicVersion); // GET /topics/:topicId/versions/:version — pega versão específica
router.get("/:topicId/tree", TopicController.getTopicTree);     // GET /topics/:topicId/tree — pega árvore recursiva
router.get("/path", TopicController.findShortestPath);          // GET /topics/path?from=<id>&to=<id> — menor caminho

export default router;
