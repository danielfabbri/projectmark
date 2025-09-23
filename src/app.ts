import "reflect-metadata";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import topicRoutes from "./routes/topicRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import authRoutes from "./routes/authRoutes";
import { ErrorHandler } from "./middleware/ErrorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rotas principais
app.use("/topics", topicRoutes);
app.use("/topics", resourceRoutes); // Recursos são sub-rotas de tópicos
app.use("/auth", authRoutes);

// Rota raiz com informações da API
app.get("/", (req, res) => {
  res.json({
    message: "ProjectMark API",
    version: "1.0.0",
    endpoints: {
      topics: {
        "POST /topics": "Criar tópico",
        "PUT /topics/:topicId": "Atualizar tópico (gera nova versão)",
        "GET /topics/:topicId": "Obter versão mais recente",
        "GET /topics/:topicId/versions/:version": "Obter versão específica",
        "GET /topics/:topicId/tree": "Obter árvore recursiva",
        "GET /topics/path?from=<id>&to=<id>": "Menor caminho entre tópicos"
      },
      resources: {
        "POST /topics/:topicId/resources": "Criar recurso para tópico",
        "GET /topics/:topicId/resources": "Listar recursos do tópico",
        "GET /resources/:id": "Obter recurso por ID",
        "PUT /resources/:id": "Atualizar recurso",
        "DELETE /resources/:id": "Deletar recurso"
      },
      auth: {
        "POST /auth/login": "Login com JWT"
      },
      system: {
        "GET /health": "Health check"
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

export default app;
