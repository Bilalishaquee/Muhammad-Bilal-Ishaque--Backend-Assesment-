import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { SubscriptionService } from '../services/SubscriptionService';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { asyncHandler } from '../../infrastructure/middleware/asyncHandler';

const router = Router();

// Initialize dependencies
const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

router.post(
  '/',
  asyncHandler((req, res) => subscriptionController.createSubscription(req, res))
);

router.get(
  '/:userId',
  asyncHandler((req, res) => subscriptionController.getUserSubscriptions(req, res))
);

router.patch(
  '/:id/cancel',
  asyncHandler((req, res) => subscriptionController.cancelSubscription(req, res))
);

router.post(
  '/:id/renew',
  asyncHandler((req, res) => subscriptionController.renewSubscription(req, res))
);

export default router;

