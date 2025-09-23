import { RoleStrategy } from "../RoleStrategy";

/**
 * Estratégia para usuários Editor
 * Pode criar, editar e visualizar conteúdo, mas não pode gerenciar usuários
 */
export class EditorStrategy implements RoleStrategy {
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
    return false;
  }

  canUpdateUser(): boolean {
    return false;
  }

  canDeleteUser(): boolean {
    return false;
  }

  canViewUsers(): boolean {
    return false;
  }

  canAccessAdminPanel(): boolean {
    return false;
  }

  canManageSystem(): boolean {
    return false;
  }

  getRoleName(): string {
    return "editor";
  }
}
