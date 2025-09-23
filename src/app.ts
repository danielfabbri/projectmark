import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import topicRoutes from "./routes/topicRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rotas principais
app.use("/topics", topicRoutes);
app.use("/topics", resourceRoutes); // Recursos são sub-rotas de tópicos
app.use("/auth", authRoutes);

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
