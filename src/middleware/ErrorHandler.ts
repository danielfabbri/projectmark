import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ValidationError } from "class-validator";
import logger from "../utils/logger"; // novo import

interface ErrorResponse {
  status: number;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}

export class ErrorHandler {
  static handle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let statusCode = 500;
    let message = "Internal server error";
    let details: any = undefined;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
      details = error.details;
    } else if (
      Array.isArray(error) &&
      error.length > 0 &&
      error[0] instanceof ValidationError
    ) {
      statusCode = 400;
      message = "Validation failed";
      details = error.map(err => ({
        property: err.property,
        value: err.value,
        constraints: err.constraints,
        children: err.children,
      }));
    } else if (error instanceof SyntaxError && "body" in error) {
      statusCode = 400;
      message = "Invalid JSON format";
    } else if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    } else if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    } else if (error.name === "ValidationError") {
      statusCode = 400;
      message = "Validation error";
      details = error.message;
    } else if (error.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
    } else if (error.name === "MongoError" && (error as any).code === 11000) {
      statusCode = 409;
      message = "Duplicate entry";
    } else {
      if (process.env.NODE_ENV === "development") {
        details = {
          stack: error.stack,
          name: error.name,
          message: error.message,
        };
      }
    }

    // 🔥 LOG estruturado com winston
    logger.error("ErrorHandler caught an error", {
      statusCode,
      message,
      details,
      path: req.path,
      method: req.method,
      stack: error.stack,
    });

    const errorResponse: ErrorResponse = {
      status: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    if (details) {
      errorResponse.details = details;
    }

    res.status(statusCode).json(errorResponse);
  }

  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static notFound(req: Request, res: Response, next: NextFunction): void {
    const error = new AppError(
      `Route ${req.method} ${req.path} not found`,
      404
    );
    next(error);
  }
}
