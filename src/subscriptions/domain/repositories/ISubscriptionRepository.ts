import { SubscriptionBundle, SubscriptionType } from '../entities/SubscriptionBundle';

export interface CreateSubscriptionBundleInput {
  userId: string;
  type: SubscriptionType;
  maxMessages: number | null;
  usedMessages: number;
  price: number;
  startDate: Date;
  endDate: Date;
  renewalDate: Date | null;
  isActive: boolean;
  autoRenew: boolean;
  cancelledAt: Date | null;
}

export interface ISubscriptionRepository {
  create(bundle: CreateSubscriptionBundleInput): Promise<SubscriptionBundle>;
  findById(id: string): Promise<SubscriptionBundle | null>;
  findByUserId(userId: string): Promise<SubscriptionBundle[]>;
  findActiveByUserId(userId: string): Promise<SubscriptionBundle[]>;
  findLatestAvailableBundle(userId: string): Promise<SubscriptionBundle | null>;
  findSubscriptionsNeedingRenewal(): Promise<SubscriptionBundle[]>;
  update(bundle: SubscriptionBundle): Promise<SubscriptionBundle>;
  cancel(id: string): Promise<SubscriptionBundle>;
}

