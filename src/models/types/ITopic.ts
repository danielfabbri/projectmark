export interface ITopic {
    id: string;                // id único da instância
    topicId: string;           // id lógico do tópico
    name: string;              // nome do tópico
    content: string;           // conteúdo
    version: number;           // versão do tópico
    parentTopicId?: string;    // id do tópico pai (opcional)
    createdAt: Date;
    updatedAt: Date;
  }
  