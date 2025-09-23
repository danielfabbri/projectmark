import { RoleStrategy } from "../RoleStrategy";

/**
 * Estratégia para usuários Admin
 * Tem acesso total a todas as funcionalidades
 */
export class AdminStrategy implements RoleStrategy {
  canCreateTopic(): boolean {
    return true;
  }

  canUpdateTopic(): boolean {
    return true;
  }

  canDeleteTopic(): boolean {
    return true;
  }

  canViewTopic(): boolean {
    return true;
  }

  canViewTopicHistory(): boolean {
    return true;
  }

  canCreateResource(): boolean {
    return true;
  }

  canUpdateResource(): boolean {
    return true;
  }

  canDeleteResource(): boolean {
    return true;
  }

  canViewResource(): boolean {
    return true;
  }

  canCreateUser(): boolean {
    return true;
  }

  canUpdateUser(): boolean {
    return true;
  }

  canDeleteUser(): boolean {
    return true;
  }

  canViewUsers(): boolean {
    return true;
  }

  canAccessAdminPanel(): boolean {
    return true;
  }

  canManageSystem(): boolean {
    return true;
  }

  getRoleName(): string {
    return "admin";
  }
}
