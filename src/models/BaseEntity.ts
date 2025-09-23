export abstract class BaseEntity {
    public readonly id: string;
    public readonly createdAt: Date;
    public updatedAt: Date;
  
    constructor(id: string) {
      this.id = id;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    /**
     * Atualiza o updatedAt para o momento atual
     */
    public touch(): void {
      this.updatedAt = new Date();
    }
  }
  