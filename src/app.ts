import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import topicRoutes from "./routes/topicRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/topics", topicRoutes);

export default app;
