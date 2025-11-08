import dotenv from 'dotenv';
import cron from 'node-cron';
import app from './app';
import { SubscriptionService } from './subscriptions/services/SubscriptionService';
import { SubscriptionRepository } from './subscriptions/repositories/SubscriptionRepository';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize subscription service for auto-renewal
const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);

// Set up cron job for auto-renewal
// Runs daily at midnight (00:00)
// Cron expression: '0 0 * * *' means: minute 0, hour 0, every day, every month, every day of week
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled auto-renewal job...');
  try {
    await subscriptionService.processAutoRenewals();
  } catch (error) {
    console.error('Error in scheduled auto-renewal job:', error);
  }
});

// For development/testing: Also run every hour to see it work faster
// Uncomment the line below if you want to test auto-renewal more frequently
// cron.schedule('0 * * * *', async () => {
//   console.log('Running hourly auto-renewal check (development mode)...');
//   try {
//     await subscriptionService.processAutoRenewals();
//   } catch (error) {
//     console.error('Error in hourly auto-renewal check:', error);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Auto-renewal cron job scheduled: Daily at midnight (00:00)');
});

