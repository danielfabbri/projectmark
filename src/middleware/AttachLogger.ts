// src/middlewares/attachLogger.ts
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function AttachLogger(req: Request, _res: Response, next: NextFunction) {
  const requestId = (req as any).requestId || "unknown";
  // create a child logger with requestId to avoid adding requestId manually every call
  (req as any).logger = logger.child({ requestId });
  next();
}
