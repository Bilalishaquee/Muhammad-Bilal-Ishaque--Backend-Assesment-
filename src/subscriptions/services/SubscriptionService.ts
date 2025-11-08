import { ISubscriptionRepository } from '../domain/repositories/ISubscriptionRepository';
import {
  SubscriptionBundle,
  SubscriptionType,
  SubscriptionLimits,
  SubscriptionPrices,
} from '../domain/entities/SubscriptionBundle';
import { AppError, ErrorCodes } from '../../infrastructure/errors/AppError';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class SubscriptionService {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  private calculateEndDate(startDate: Date, cycle: BillingCycle): Date {
    const endDate = new Date(startDate);
    if (cycle === BillingCycle.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    return endDate;
  }

  private simulatePaymentFailure(): boolean {
    // 10% chance of payment failure
    return Math.random() < 0.1;
  }

  async createSubscription(
    userId: string,
    type: SubscriptionType,
    cycle: BillingCycle = BillingCycle.MONTHLY,
    autoRenew: boolean = false
  ): Promise<SubscriptionBundle> {
    const startDate = new Date();
    const endDate = this.calculateEndDate(startDate, cycle);
    const limit = SubscriptionLimits[type];
    // Store null in DB for unlimited, otherwise store the number
    const maxMessages = limit === Infinity ? null : limit;
    const price = SubscriptionPrices[type] * (cycle === BillingCycle.YEARLY ? 10 : 1); // Yearly is 10x monthly

    // Simulate payment
    if (this.simulatePaymentFailure()) {
      throw new AppError(
        ErrorCodes.PAYMENT_FAILED,
        'Payment processing failed. Please try again.',
        402
      );
    }

    const bundle = await this.subscriptionRepository.create({
      userId,
      type,
      maxMessages,
      usedMessages: 0,
      price,
      startDate,
      endDate,
      renewalDate: null,
      isActive: true,
      autoRenew,
      cancelledAt: null,
    });

    return bundle;
  }

  async getUserSubscriptions(userId: string): Promise<SubscriptionBundle[]> {
    return this.subscriptionRepository.findByUserId(userId);
  }

  async getActiveSubscriptions(userId: string): Promise<SubscriptionBundle[]> {
    return this.subscriptionRepository.findActiveByUserId(userId);
  }

  async cancelSubscription(id: string): Promise<SubscriptionBundle> {
    const bundle = await this.subscriptionRepository.findById(id);

    if (!bundle) {
      throw new AppError(ErrorCodes.SUBSCRIPTION_NOT_FOUND, 'Subscription not found', 404);
    }

    bundle.cancel();
    return this.subscriptionRepository.update(bundle);
  }

  async renewSubscription(
    id: string,
    cycle: BillingCycle = BillingCycle.MONTHLY
  ): Promise<SubscriptionBundle> {
    const bundle = await this.subscriptionRepository.findById(id);

    if (!bundle) {
      throw new AppError(ErrorCodes.SUBSCRIPTION_NOT_FOUND, 'Subscription not found', 404);
    }

    // Simulate payment
    if (this.simulatePaymentFailure()) {
      throw new AppError(
        ErrorCodes.PAYMENT_FAILED,
        'Payment processing failed. Please try again.',
        402
      );
    }

    const startDate = bundle.endDate > new Date() ? bundle.endDate : new Date();
    const endDate = this.calculateEndDate(startDate, cycle);

    bundle.renew(endDate);
    return this.subscriptionRepository.update(bundle);
  }

  private determineBillingCycle(bundle: SubscriptionBundle): BillingCycle {
    // Determine the billing cycle from the current subscription period
    // If the subscription has been renewed, use the renewal date as the start of the current period
    // Otherwise, use the original start date
    const periodStart = bundle.renewalDate || bundle.startDate;
    const durationMs = bundle.endDate.getTime() - periodStart.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    // If duration is approximately 1 year (365 days ± 30 days), it's yearly
    // Otherwise, assume monthly (approximately 28-31 days)
    if (durationDays >= 335 && durationDays <= 395) {
      return BillingCycle.YEARLY;
    }
    return BillingCycle.MONTHLY;
  }

  async processAutoRenewals(): Promise<void> {
    console.log('Processing auto-renewals...');
    
    try {
      // Find subscriptions that need renewal
      const subscriptions = await this.subscriptionRepository.findSubscriptionsNeedingRenewal();
      
      console.log(`Found ${subscriptions.length} subscription(s) needing renewal`);

      for (const bundle of subscriptions) {
        try {
          // Determine the billing cycle from the original subscription
          const cycle = this.determineBillingCycle(bundle);

          console.log(`Processing auto-renewal for subscription ${bundle.id} (${bundle.type}, ${cycle})`);

          // Simulate payment
          if (this.simulatePaymentFailure()) {
            // Payment failed - mark subscription as inactive
            console.log(`Payment failed for subscription ${bundle.id} - marking as inactive`);
            bundle.isActive = false;
            await this.subscriptionRepository.update(bundle);
            continue;
          }

          // Payment succeeded - renew the subscription
          const startDate = bundle.endDate > new Date() ? bundle.endDate : new Date();
          const endDate = this.calculateEndDate(startDate, cycle);

          // Reset usedMessages for the new billing cycle
          bundle.usedMessages = 0;
          bundle.renew(endDate);

          await this.subscriptionRepository.update(bundle);
          console.log(`Successfully renewed subscription ${bundle.id} until ${endDate.toISOString()}`);
        } catch (error) {
          console.error(`Error processing auto-renewal for subscription ${bundle.id}:`, error);
          // Continue processing other subscriptions even if one fails
        }
      }

      console.log('Auto-renewal processing completed');
    } catch (error) {
      console.error('Error in processAutoRenewals:', error);
      throw error;
    }
  }
}

