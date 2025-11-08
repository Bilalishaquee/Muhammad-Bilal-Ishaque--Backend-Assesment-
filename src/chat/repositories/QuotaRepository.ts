import prisma from '../../infrastructure/database/prisma';
import { IQuotaRepository } from '../domain/repositories/IQuotaRepository';

export class QuotaRepository implements IQuotaRepository {
  async getOrCreateMonthlyQuota(
    userId: string,
    month: number,
    year: number
  ): Promise<{
    id: string;
    userId: string;
    month: number;
    year: number;
    usedCount: number;
  }> {
    const quota = await prisma.userQuota.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      update: {},
      create: {
        userId,
        month,
        year,
        usedCount: 0,
      },
    });

    return quota;
  }

  async incrementUsage(userId: string, month: number, year: number): Promise<void> {
    await prisma.userQuota.updateMany({
      where: {
        userId,
        month,
        year,
      },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }

  async getUsageCount(userId: string, month: number, year: number): Promise<number> {
    const quota = await prisma.userQuota.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    return quota?.usedCount ?? 0;
  }

  async resetMonthlyQuota(userId: string, month: number, year: number): Promise<void> {
    await prisma.userQuota.updateMany({
      where: {
        userId,
        month,
        year,
      },
      data: {
        usedCount: 0,
      },
    });
  }
}

