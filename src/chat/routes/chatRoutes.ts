import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { ChatService } from '../services/ChatService';
import { ChatRepository } from '../repositories/ChatRepository';
import { QuotaRepository } from '../repositories/QuotaRepository';
import { SubscriptionRepository } from '../../subscriptions/repositories/SubscriptionRepository';
import { asyncHandler } from '../../infrastructure/middleware/asyncHandler';

const router = Router();

// Initialize dependencies
const chatRepository = new ChatRepository();
const quotaRepository = new QuotaRepository();
const subscriptionRepository = new SubscriptionRepository();
const chatService = new ChatService(chatRepository, quotaRepository, subscriptionRepository);
const chatController = new ChatController(chatService);

router.post(
  '/',
  asyncHandler((req, res) => chatController.sendMessage(req, res))
);

export default router;

