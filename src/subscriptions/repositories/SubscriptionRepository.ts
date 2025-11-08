import prisma from '../../infrastructure/database/prisma';
import { SubscriptionBundle } from '../domain/entities/SubscriptionBundle';
import {
  ISubscriptionRepository,
  CreateSubscriptionBundleInput,
} from '../domain/repositories/ISubscriptionRepository';

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(bundle: CreateSubscriptionBundleInput): Promise<SubscriptionBundle> {
    const created = await prisma.subscriptionBundle.create({
      data: {
        userId: bundle.userId,
        type: bundle.type,
        maxMessages: bundle.maxMessages === Infinity ? null : bundle.maxMessages,
        usedMessages: bundle.usedMessages,
        price: bundle.price,
        startDate: bundle.startDate,
        endDate: bundle.endDate,
        renewalDate: bundle.renewalDate,
        isActive: bundle.isActive,
        autoRenew: bundle.autoRenew,
        cancelledAt: bundle.cancelledAt,
      },
    });

    return SubscriptionBundle.fromPrisma(created);
  }

  async findById(id: string): Promise<SubscriptionBundle | null> {
    const bundle = await prisma.subscriptionBundle.findUnique({
      where: { id },
    });

    return bundle ? SubscriptionBundle.fromPrisma(bundle) : null;
  }

  async findByUserId(userId: string): Promise<SubscriptionBundle[]> {
    const bundles = await prisma.subscriptionBundle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return bundles.map(SubscriptionBundle.fromPrisma);
  }

  async findActiveByUserId(userId: string): Promise<SubscriptionBundle[]> {
    const now = new Date();
    const bundles = await prisma.subscriptionBundle.findMany({
      where: {
        userId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bundles.map(SubscriptionBundle.fromPrisma);
  }

  async findLatestAvailableBundle(userId: string): Promise<SubscriptionBundle | null> {
    const now = new Date();
    // Include both active and cancelled subscriptions (cancelled ones are valid until endDate)
    const bundles = await prisma.subscriptionBundle.findMany({
      where: {
        userId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    for (const bundle of bundles) {
      const subBundle = SubscriptionBundle.fromPrisma(bundle);
      if (subBundle.remainingMessages > 0 || subBundle.remainingMessages === Infinity) {
        return subBundle;
      }
    }

    return null;
  }

  async findSubscriptionsNeedingRenewal(): Promise<SubscriptionBundle[]> {
    const now = new Date();
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    // Find subscriptions that:
    // - Have autoRenew enabled
    // - Are not cancelled
    // - End date is within the next 24 hours or has just passed (allow some grace period)
    // We include expired subscriptions (up to 1 day past) in case the cron job was delayed
    const bundles = await prisma.subscriptionBundle.findMany({
      where: {
        autoRenew: true,
        cancelledAt: null,
        endDate: {
          lte: oneDayFromNow,
        },
      },
      orderBy: { endDate: 'asc' }, // Process soonest expiring first
    });

    return bundles.map(SubscriptionBundle.fromPrisma);
  }

  async update(bundle: SubscriptionBundle): Promise<SubscriptionBundle> {
    const updated = await prisma.subscriptionBundle.update({
      where: { id: bundle.id },
      data: {
        maxMessages: bundle.maxMessages === Infinity ? null : bundle.maxMessages,
        usedMessages: bundle.usedMessages,
        isActive: bundle.isActive,
        autoRenew: bundle.autoRenew,
        endDate: bundle.endDate,
        renewalDate: bundle.renewalDate,
        cancelledAt: bundle.cancelledAt,
      },
    });

    return SubscriptionBundle.fromPrisma(updated);
  }

  async cancel(id: string): Promise<SubscriptionBundle> {
    const updated = await prisma.subscriptionBundle.update({
      where: { id },
      data: {
        isActive: false,
        cancelledAt: new Date(),
      },
    });

    return SubscriptionBundle.fromPrisma(updated);
  }
}

