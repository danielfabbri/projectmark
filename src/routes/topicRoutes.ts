import { Router } from "express";
import { TopicController } from "../controllers/TopicController";

const router = Router();

router.get("/", TopicController.findAll);
router.get("/:id", TopicController.findById);
router.post("/", TopicController.create);
router.put("/:id", TopicController.update);
router.delete("/:id", TopicController.delete);

export default router;
