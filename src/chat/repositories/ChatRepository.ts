import prisma from '../../infrastructure/database/prisma';
import { ChatMessage } from '../domain/entities/ChatMessage';
import { IChatRepository, CreateChatMessageInput } from '../domain/repositories/IChatRepository';

export class ChatRepository implements IChatRepository {
  async create(message: CreateChatMessageInput): Promise<ChatMessage> {
    const created = await prisma.chatMessage.create({
      data: {
        userId: message.userId,
        question: message.question,
        answer: message.answer,
        tokensUsed: message.tokensUsed,
      },
    });

    return ChatMessage.fromPrisma(created);
  }

  async findByUserId(userId: string, limit = 50): Promise<ChatMessage[]> {
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.map(ChatMessage.fromPrisma);
  }
}

