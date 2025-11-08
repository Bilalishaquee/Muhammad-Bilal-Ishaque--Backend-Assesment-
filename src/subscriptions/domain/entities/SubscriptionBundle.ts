export enum SubscriptionType {
  BASIC = 'Basic',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise',
}

export const SubscriptionLimits: Record<SubscriptionType, number> = {
  [SubscriptionType.BASIC]: 10,
  [SubscriptionType.PRO]: 100,
  [SubscriptionType.ENTERPRISE]: Infinity,
};

export const SubscriptionPrices: Record<SubscriptionType, number> = {
  [SubscriptionType.BASIC]: 9.99,
  [SubscriptionType.PRO]: 49.99,
  [SubscriptionType.ENTERPRISE]: 199.99,
};

export class SubscriptionBundle {
  constructor(
    public id: string,
    public userId: string,
    public type: SubscriptionType,
    public maxMessages: number | null, // null represents unlimited
    public usedMessages: number,
    public price: number,
    public startDate: Date,
    public endDate: Date,
    public renewalDate: Date | null,
    public isActive: boolean,
    public autoRenew: boolean,
    public cancelledAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  get remainingMessages(): number {
    if (this.maxMessages === null || this.maxMessages === Infinity) {
      return Infinity;
    }
    return Math.max(0, this.maxMessages - this.usedMessages);
  }

  get isValid(): boolean {
    const now = new Date();
    // A subscription is valid if it's within the date range (startDate <= now <= endDate)
    // Cancelled subscriptions remain valid until endDate (they just won't auto-renew)
    const withinDateRange = now >= this.startDate && now <= this.endDate;
    return withinDateRange;
  }

  useMessage(): void {
    if (this.remainingMessages > 0 && this.remainingMessages !== Infinity) {
      this.usedMessages += 1;
    }
  }

  cancel(): void {
    this.isActive = false;
    this.cancelledAt = new Date();
  }

  renew(endDate: Date): void {
    this.endDate = endDate;
    this.renewalDate = new Date();
    this.isActive = true;
    if (this.cancelledAt) {
      this.cancelledAt = null;
    }
  }

  static fromPrisma(data: {
    id: string;
    userId: string;
    type: string;
    maxMessages: number | null;
    usedMessages: number;
    price: number;
    startDate: Date;
    endDate: Date;
    renewalDate: Date | null;
    isActive: boolean;
    autoRenew: boolean;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): SubscriptionBundle {
    return new SubscriptionBundle(
      data.id,
      data.userId,
      data.type as SubscriptionType,
      data.maxMessages,
      data.usedMessages,
      data.price,
      data.startDate,
      data.endDate,
      data.renewalDate,
      data.isActive,
      data.autoRenew,
      data.cancelledAt,
      data.createdAt,
      data.updatedAt
    );
  }
}

