import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { AppError } from "../errors/AppError";

/**
 * Middleware para validação de DTOs usando class-validator
 */
export class ValidationMiddleware {
  /**
   * Valida um DTO específico
   */
  static validate<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Transformar o body da requisição em instância da classe DTO
        const dto = plainToClass(dtoClass, req.body);
        
        // Validar o DTO
        const errors = await validate(dto);
        
        if (errors.length > 0) {
          // Se houver erros de validação, passar para o error handler
          return next(errors);
        }
        
        // Se não houver erros, substituir o body pela instância validada
        req.body = dto;
        next();
      } catch (error) {
        next(new AppError("Validation error", 400, true, error));
      }
    };
  }

  /**
   * Valida parâmetros da URL (como IDs)
   */
  static validateParams<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToClass(dtoClass, req.params);
        const errors = await validate(dto);
        
        if (errors.length > 0) {
          return next(errors);
        }
        
        req.params = dto as any;
        next();
      } catch (error) {
        next(new AppError("Parameter validation error", 400, true, error));
      }
    };
  }

  /**
   * Valida query parameters
   */
  static validateQuery<T extends object>(dtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToClass(dtoClass, req.query);
        const errors = await validate(dto);
        
        if (errors.length > 0) {
          return next(errors);
        }
        
        req.query = dto as any;
        next();
      } catch (error) {
        next(new AppError("Query validation error", 400, true, error));
      }
    };
  }
}
