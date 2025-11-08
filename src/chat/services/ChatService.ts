import { IChatRepository } from '../domain/repositories/IChatRepository';
import { IQuotaRepository } from '../domain/repositories/IQuotaRepository';
import { ISubscriptionRepository } from '../../subscriptions/domain/repositories/ISubscriptionRepository';
import { AppError, ErrorCodes } from '../../infrastructure/errors/AppError';

const FREE_MONTHLY_QUOTA = 3;

export class ChatService {
  constructor(
    private chatRepository: IChatRepository,
    private quotaRepository: IQuotaRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  private async simulateOpenAIResponse(question: string): Promise<{ answer: string; tokensUsed: number }> {
    // Simulate delay between 1-3 seconds
    const delay = Math.random() * 2000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Mock response
    const answer = `This is a mock response to: "${question}". The AI would process this query and return a relevant answer.`;
    const tokensUsed = Math.floor(Math.random() * 100) + 50; // Random tokens between 50-150

    return { answer, tokensUsed };
  }

  private getCurrentMonthYear(): { month: number; year: number } {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  }

  private async ensureCurrentMonthQuota(userId: string): Promise<void> {
    // This will automatically create a new quota with usedCount: 0 for the current month
    // if it doesn't exist, effectively resetting the quota on the 1st of each month
    const { month, year } = this.getCurrentMonthYear();
    await this.quotaRepository.getOrCreateMonthlyQuota(userId, month, year);
  }

  async sendMessage(userId: string, question: string): Promise<{ answer: string; tokensUsed: number }> {
    // Ensure current month's quota exists (auto-resets on new month)
    await this.ensureCurrentMonthQuota(userId);

    const { month, year } = this.getCurrentMonthYear();

    // Check free quota
    const usedCount = await this.quotaRepository.getUsageCount(userId, month, year);

    if (usedCount >= FREE_MONTHLY_QUOTA) {
      // Check if user has an active subscription
      const activeBundle = await this.subscriptionRepository.findLatestAvailableBundle(userId);

      if (!activeBundle || !activeBundle.isValid) {
        throw new AppError(
          ErrorCodes.QUOTA_EXCEEDED,
          'You have reached your monthly free quota. Please subscribe to continue.',
          403
        );
      }

      // Check if bundle has remaining messages
      if (activeBundle.remainingMessages === 0) {
        throw new AppError(
          ErrorCodes.QUOTA_EXCEEDED,
          'Your subscription bundle has been exhausted. Please renew or upgrade.',
          403
        );
      }

      // Use message from bundle
      activeBundle.useMessage();
      await this.subscriptionRepository.update(activeBundle);
    } else {
      // Use free quota
      await this.quotaRepository.incrementUsage(userId, month, year);
    }

    // Simulate OpenAI API call
    const { answer, tokensUsed } = await this.simulateOpenAIResponse(question);

    // Save chat message
    await this.chatRepository.create({
      userId,
      question,
      answer,
      tokensUsed,
    });

    return { answer, tokensUsed };
  }
}

