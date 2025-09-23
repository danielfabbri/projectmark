import { RoleStrategy } from "../RoleStrategy";

/**
 * Estratégia para usuários Viewer
 * Pode apenas visualizar conteúdo, sem permissões de escrita
 */
export class ViewerStrategy implements RoleStrategy {
  canCreateTopic(): boolean {
    return false;
  }

  canUpdateTopic(): boolean {
    return false;
  }

  canDeleteTopic(): boolean {
    return false;
  }

  canViewTopic(): boolean {
    return true;
  }

  canViewTopicHistory(): boolean {
    return true;
  }

  canCreateResource(): boolean {
    return false;
  }

  canUpdateResource(): boolean {
    return false;
  }

  canDeleteResource(): boolean {
    return false;
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
    return "viewer";
  }
}
