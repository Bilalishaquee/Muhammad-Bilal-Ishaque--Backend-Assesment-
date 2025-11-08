import { ChatMessage } from '../entities/ChatMessage';

export interface CreateChatMessageInput {
  userId: string;
  question: string;
  answer: string;
  tokensUsed: number;
}

export interface IChatRepository {
  create(message: CreateChatMessageInput): Promise<ChatMessage>;
  findByUserId(userId: string, limit?: number): Promise<ChatMessage[]>;
}

