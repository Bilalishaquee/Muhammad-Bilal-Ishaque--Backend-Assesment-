export class ChatMessage {
  constructor(
    public id: string,
    public userId: string,
    public question: string,
    public answer: string,
    public tokensUsed: number,
    public createdAt: Date
  ) {}

  static fromPrisma(data: {
    id: string;
    userId: string;
    question: string;
    answer: string;
    tokensUsed: number;
    createdAt: Date;
  }): ChatMessage {
    return new ChatMessage(
      data.id,
      data.userId,
      data.question,
      data.answer,
      data.tokensUsed,
      data.createdAt
    );
  }
}

