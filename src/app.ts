import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middlewares básicos
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas (placeholder — depois você cria a pasta routes/)
app.get("/", (req, res) => {
  res.json({ message: "API Knowledge Base online 🚀" });
});

export default app;
