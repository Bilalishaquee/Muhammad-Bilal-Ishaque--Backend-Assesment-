import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';
import { AppError, ErrorCodes } from '../../infrastructure/errors/AppError';

export class ChatController {
  constructor(private chatService: ChatService) {}

  async sendMessage(req: Request, res: Response): Promise<void> {
    const { userId, question } = req.body;

    if (!userId || !question) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'userId and question are required',
        400
      );
    }

    if (typeof userId !== 'string' || typeof question !== 'string') {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'userId and question must be strings',
        400
      );
    }

    const result = await this.chatService.sendMessage(userId, question);
    res.json(result);
  }
}

