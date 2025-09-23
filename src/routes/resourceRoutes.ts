import { Router } from "express";
import { ResourceController } from "../controllers/ResourceController";

const router = Router();

// Rotas para recursos conforme especificação
router.post("/:topicId/resources", ResourceController.createResource);     // POST /topics/:topicId/resources
router.get("/:topicId/resources", ResourceController.getResourcesByTopic); // GET /topics/:topicId/resources
router.get("/resources/:id", ResourceController.getResourceById);          // GET /resources/:id
router.put("/resources/:id", ResourceController.updateResource);           // PUT /resources/:id
router.delete("/resources/:id", ResourceController.deleteResource);        // DELETE /resources/:id

export default router;
