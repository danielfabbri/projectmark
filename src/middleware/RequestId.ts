// src/middlewares/requestId.ts
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function RequestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = (req.headers["x-request-id"] as string) || null;
  const requestId = incoming || uuidv4();
  // attach to req (simple approach)
  (req as any).requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}
