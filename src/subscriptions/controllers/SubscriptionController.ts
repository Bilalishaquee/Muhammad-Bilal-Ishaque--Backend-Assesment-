import { Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';
import { SubscriptionType, SubscriptionBundle } from '../domain/entities/SubscriptionBundle';
import { BillingCycle } from '../services/SubscriptionService';
import { AppError, ErrorCodes } from '../../infrastructure/errors/AppError';

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  async createSubscription(req: Request, res: Response): Promise<void> {
    const { userId, type, cycle, autoRenew } = req.body;

    if (!userId || !type) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        'userId and type are required',
        400
      );
    }

    if (!Object.values(SubscriptionType).includes(type as SubscriptionType)) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        `type must be one of: ${Object.values(SubscriptionType).join(', ')}`,
        400
      );
    }

    const billingCycle = cycle || BillingCycle.MONTHLY;
    if (!Object.values(BillingCycle).includes(billingCycle)) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        `cycle must be one of: ${Object.values(BillingCycle).join(', ')}`,
        400
      );
    }

    const bundle = await this.subscriptionService.createSubscription(
      userId,
      type as SubscriptionType,
      billingCycle,
      autoRenew || false
    );

    res.status(201).json(this.serializeBundle(bundle));
  }

  async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError(ErrorCodes.INVALID_INPUT, 'userId is required', 400);
    }

    const bundles = await this.subscriptionService.getUserSubscriptions(userId);
    res.json(bundles.map((b) => this.serializeBundle(b)));
  }

  async cancelSubscription(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new AppError(ErrorCodes.INVALID_INPUT, 'id is required', 400);
    }

    const bundle = await this.subscriptionService.cancelSubscription(id);
    res.json(this.serializeBundle(bundle));
  }

  async renewSubscription(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { cycle } = req.body;

    if (!id) {
      throw new AppError(ErrorCodes.INVALID_INPUT, 'id is required', 400);
    }

    const billingCycle = cycle || BillingCycle.MONTHLY;
    if (cycle && !Object.values(BillingCycle).includes(billingCycle)) {
      throw new AppError(
        ErrorCodes.INVALID_INPUT,
        `cycle must be one of: ${Object.values(BillingCycle).join(', ')}`,
        400
      );
    }

    const bundle = await this.subscriptionService.renewSubscription(id, billingCycle);
    res.json(this.serializeBundle(bundle));
  }

  private serializeBundle(bundle: SubscriptionBundle): any {
    return {
      id: bundle.id,
      userId: bundle.userId,
      type: bundle.type,
      maxMessages: bundle.maxMessages === Infinity ? 'unlimited' : bundle.maxMessages,
      usedMessages: bundle.usedMessages,
      remainingMessages:
        bundle.remainingMessages === Infinity ? 'unlimited' : bundle.remainingMessages,
      price: bundle.price,
      startDate: bundle.startDate,
      endDate: bundle.endDate,
      renewalDate: bundle.renewalDate,
      isActive: bundle.isActive,
      autoRenew: bundle.autoRenew,
      cancelledAt: bundle.cancelledAt,
      createdAt: bundle.createdAt,
      updatedAt: bundle.updatedAt,
    };
  }
}

