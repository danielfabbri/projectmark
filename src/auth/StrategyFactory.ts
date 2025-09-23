import { RoleStrategy } from "./RoleStrategy";
import { AdminStrategy } from "./strategies/AdminStrategy";
import { EditorStrategy } from "./strategies/EditorStrategy";
import { ViewerStrategy } from "./strategies/ViewerStrategy";

/**
 * Factory para criar estratégias de autorização baseadas no role do usuário
 */
export class StrategyFactory {
  /**
   * Cria uma estratégia baseada no role do usuário
   */
  static createStrategy(role: string): RoleStrategy {
    switch (role.toLowerCase()) {
      case "admin":
        return new AdminStrategy();
      case "editor":
        return new EditorStrategy();
      case "viewer":
        return new ViewerStrategy();
      default:
        // Por padrão, retorna ViewerStrategy (mais restritiva)
        return new ViewerStrategy();
    }
  }

  /**
   * Lista todos os roles disponíveis
   */
  static getAvailableRoles(): string[] {
    return ["admin", "editor", "viewer"];
  }

  /**
   * Verifica se um role é válido
   */
  static isValidRole(role: string): boolean {
    return this.getAvailableRoles().includes(role.toLowerCase());
  }
}
