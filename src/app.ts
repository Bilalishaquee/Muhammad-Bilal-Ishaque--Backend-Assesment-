import express from 'express';
import chatRoutes from './chat/routes/chatRoutes';
import subscriptionRoutes from './subscriptions/routes/subscriptionRoutes';
import { errorHandler } from './infrastructure/middleware/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;

