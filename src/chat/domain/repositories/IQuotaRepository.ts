export interface IQuotaRepository {
  getOrCreateMonthlyQuota(userId: string, month: number, year: number): Promise<{
    id: string;
    userId: string;
    month: number;
    year: number;
    usedCount: number;
  }>;
  incrementUsage(userId: string, month: number, year: number): Promise<void>;
  getUsageCount(userId: string, month: number, year: number): Promise<number>;
  resetMonthlyQuota(userId: string, month: number, year: number): Promise<void>;
}

