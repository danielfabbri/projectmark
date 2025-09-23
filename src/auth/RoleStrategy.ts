/**
 * Interface para Strategy pattern de autorização
 * Define as permissões que cada role pode ter
 */
export interface RoleStrategy {
  // Permissões para tópicos
  canCreateTopic(): boolean;
  canUpdateTopic(): boolean;
  canDeleteTopic(): boolean;
  canViewTopic(): boolean;
  canViewTopicHistory(): boolean;
  
  // Permissões para recursos
  canCreateResource(): boolean;
  canUpdateResource(): boolean;
  canDeleteResource(): boolean;
  canViewResource(): boolean;
  
  // Permissões para usuários
  canCreateUser(): boolean;
  canUpdateUser(): boolean;
  canDeleteUser(): boolean;
  canViewUsers(): boolean;
  
  // Permissões administrativas
  canAccessAdminPanel(): boolean;
  canManageSystem(): boolean;
  
  // Nome da estratégia
  getRoleName(): string;
}
