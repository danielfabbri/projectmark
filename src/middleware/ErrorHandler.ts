import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ValidationError } from "class-validator";

/**
 * Interface para resposta de erro padronizada
 */
interface ErrorResponse {
  status: number;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}

/**
 * Middleware centralizado para tratamento de erros
 */
export class ErrorHandler {
  /**
   * Middleware principal de tratamento de erros
   */
  static handle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let statusCode = 500;
    let message = "Internal server error";
    let details: any = undefined;

    // Se for um erro customizado da aplicação
    if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
      details = error.details;
    }
    // Se for um erro de validação do class-validator
    else if (Array.isArray(error) && error.length > 0 && error[0] instanceof ValidationError) {
      statusCode = 400;
      message = "Validation failed";
      details = error.map(err => ({
        property: err.property,
        value: err.value,
        constraints: err.constraints,
        children: err.children
      }));
    }
    // Se for um erro de sintaxe JSON
    else if (error instanceof SyntaxError && 'body' in error) {
      statusCode = 400;
      message = "Invalid JSON format";
    }
    // Se for um erro de JWT
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = "Invalid token";
    }
    else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = "Token expired";
    }
    // Se for um erro de validação do Express
    else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = "Validation error";
      details = error.message;
    }
    // Se for um erro de cast do MongoDB/Mongoose
    else if (error.name === 'CastError') {
      statusCode = 400;
      message = "Invalid ID format";
    }
    // Se for um erro de duplicação
    else if (error.name === 'MongoError' && (error as any).code === 11000) {
      statusCode = 409;
      message = "Duplicate entry";
    }
    // Para outros erros não tratados
    else {
      // Em desenvolvimento, mostrar detalhes do erro
      if (process.env.NODE_ENV === 'development') {
        details = {
          stack: error.stack,
          name: error.name,
          message: error.message
        };
      }
    }

    // Log do erro (em produção, usar um logger adequado)
    console.error(`[${new Date().toISOString()}] Error:`, {
      statusCode,
      message,
      details,
      path: req.path,
      method: req.method,
      stack: error.stack
    });

    // Resposta padronizada
    const errorResponse: ErrorResponse = {
      status: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.path
    };

    if (details) {
      errorResponse.details = details;
    }

    res.status(statusCode).json(errorResponse);
  }

  /**
   * Middleware para capturar erros assíncronos
   */
  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Middleware para rotas não encontradas (404)
   */
  static notFound(req: Request, res: Response, next: NextFunction): void {
    const error = new AppError(`Route ${req.method} ${req.path} not found`, 404);
    next(error);
  }
}
