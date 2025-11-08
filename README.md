# Backend Assessment - TypeScript REST API

A comprehensive TypeScript REST API backend implementing AI Chat and Subscription Bundle modules following **Domain-Driven Design (DDD)** and **Clean Architecture** principles. This project demonstrates enterprise-level backend development with proper separation of concerns, dependency inversion, and scalable architecture patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Business Logic](#business-logic)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

## 🎯 Overview

This backend assessment project implements two main modules:

1. **AI Chat Module**: Handles chat messages with quota management, OpenAI API simulation, and message history tracking.
2. **Subscription Bundle Module**: Manages subscription plans (Basic, Pro, Enterprise) with auto-renewal, billing cycles, and quota allocation.

The system enforces a freemium model where users get 3 free messages per month. After exceeding the free quota, users must subscribe to continue using the chat service.

## ✨ Features

### Chat Module
- ✅ Send chat messages with AI response simulation
- ✅ Free monthly quota (3 messages per user per month)
- ✅ Automatic quota reset on the 1st of each month
- ✅ Integration with subscription bundles for quota management
- ✅ Message history tracking with token usage
- ✅ OpenAI API simulation with realistic delays and token counts

### Subscription Module
- ✅ Three subscription tiers: Basic (10 messages), Pro (100 messages), Enterprise (unlimited)
- ✅ Monthly and yearly billing cycles
- ✅ Auto-renewal support with scheduled cron jobs
- ✅ Manual subscription renewal
- ✅ Subscription cancellation (remains valid until end of billing period)
- ✅ Multiple active subscriptions per user
- ✅ Payment failure simulation (10% chance)
- ✅ Automatic usage tracking and quota deduction
- ✅ Subscription status management (active, cancelled, expired)

### Infrastructure
- ✅ PostgreSQL database with Prisma ORM
- ✅ Domain-Driven Design architecture
- ✅ Clean Architecture with dependency inversion
- ✅ Centralized error handling
- ✅ Request validation
- ✅ TypeScript with strict type checking
- ✅ Automated database migrations
- ✅ Database seeding for development

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript 5.3+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL
- **ORM**: Prisma 5.7+
- **Validation**: Zod 3.22+
- **Scheduling**: node-cron 4.2+
- **Environment**: dotenv 16.3+

### Development Tools

- **TypeScript Compiler**: tsc
- **Development Server**: ts-node-dev
- **Linting**: ESLint with TypeScript plugin
- **Code Formatting**: Prettier

## 🏗 Architecture

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles:

### Architectural Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Controllers, Routes, Middleware)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Application Layer               │
│         (Services, Use Cases)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Domain Layer                    │
│  (Entities, Domain Logic, Interfaces)   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Infrastructure Layer               │
│  (Database, External Services, Errors)  │
└─────────────────────────────────────────┘
```

### Key Principles

1. **Dependency Inversion**: High-level modules don't depend on low-level modules. Both depend on abstractions (interfaces).
2. **Separation of Concerns**: Each layer has a single responsibility.
3. **Domain-Centric**: Business logic is contained within domain entities.
4. **Testability**: Dependencies are injected, making unit testing straightforward.

### Module Organization

Each feature module (Chat, Subscriptions) is organized as:

```
module/
├── domain/              # Domain layer
│   ├── entities/        # Domain models with business logic
│   └── repositories/    # Repository interfaces (abstractions)
├── services/            # Application layer (use cases)
├── controllers/         # Presentation layer (HTTP handlers)
├── repositories/        # Infrastructure layer (implementations)
└── routes/             # Route definitions
```

## 📁 Project Structure

```
backend-assessment/
├── src/
│   ├── app.ts                          # Express app configuration
│   ├── index.ts                        # Application entry point with cron jobs
│   │
│   ├── chat/                           # Chat Module
│   │   ├── controllers/
│   │   │   └── ChatController.ts       # HTTP request handlers
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── ChatMessage.ts      # Chat message domain entity
│   │   │   └── repositories/
│   │   │       ├── IChatRepository.ts  # Chat repository interface
│   │   │       └── IQuotaRepository.ts # Quota repository interface
│   │   ├── repositories/
│   │   │   ├── ChatRepository.ts       # Chat repository implementation
│   │   │   └── QuotaRepository.ts      # Quota repository implementation
│   │   ├── routes/
│   │   │   └── chatRoutes.ts           # Chat route definitions
│   │   └── services/
│   │       └── ChatService.ts          # Chat business logic
│   │
│   ├── subscriptions/                  # Subscription Module
│   │   ├── controllers/
│   │   │   └── SubscriptionController.ts
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── SubscriptionBundle.ts
│   │   │   └── repositories/
│   │   │       └── ISubscriptionRepository.ts
│   │   ├── repositories/
│   │   │   └── SubscriptionRepository.ts
│   │   ├── routes/
│   │   │   └── subscriptionRoutes.ts
│   │   └── services/
│   │       └── SubscriptionService.ts
│   │
│   └── infrastructure/                 # Shared Infrastructure
│       ├── database/
│       │   └── prisma.ts               # Prisma client instance
│       ├── errors/
│       │   └── AppError.ts             # Custom error class
│       └── middleware/
│           ├── asyncHandler.ts         # Async error handler wrapper
│           └── errorHandler.ts         # Global error handler
│
├── prisma/
│   ├── schema.prisma                   # Database schema definition
│   ├── migrations/                     # Database migrations
│   └── seed.ts                         # Database seeding script
│
├── dist/                               # Compiled JavaScript (generated)
├── node_modules/                       # Dependencies (generated)
│
├── package.json                        # Project dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── .env                                # Environment variables (create this)
└── README.md                           # This file
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v12.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd backend-assessment
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/backend_assessment?schema=public"

# Server
PORT=3000
NODE_ENV=development
```

**Important**: Replace `username`, `password`, `localhost`, `5432`, and `backend_assessment` with your actual PostgreSQL credentials and database name.

### Step 4: Database Setup

1. **Create the database** (if it doesn't exist):
   ```bash
   # Using psql
   createdb backend_assessment
   
   # Or using SQL
   psql -U postgres
   CREATE DATABASE backend_assessment;
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

3. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

4. **Seed the database** (optional, for development):
   ```bash
   npm run prisma:seed
   ```

### Step 5: Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Step 6: Verify Installation

Check the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🗄 Database Schema

The application uses three main database tables:

### 1. `chat_messages`
Stores all chat messages and their AI responses.

| Column      | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| id          | String    | Unique identifier (CUID)             |
| userId      | String    | User identifier                      |
| question    | String    | User's question                      |
| answer      | String    | AI-generated answer                  |
| tokensUsed  | Int       | Number of tokens consumed            |
| createdAt   | DateTime  | Message timestamp                    |

**Indexes**: `(userId, createdAt)` for efficient user message queries.

### 2. `subscription_bundles`
Stores user subscription plans and usage.

| Column        | Type      | Description                                    |
|---------------|-----------|------------------------------------------------|
| id            | String    | Unique identifier (CUID)                       |
| userId        | String    | User identifier                                |
| type          | String    | Subscription type: Basic, Pro, Enterprise      |
| maxMessages   | Int?      | Maximum messages (null = unlimited)            |
| usedMessages  | Int       | Number of messages used                        |
| price         | Float     | Subscription price                             |
| startDate     | DateTime  | Subscription start date                        |
| endDate       | DateTime  | Subscription end date                          |
| renewalDate   | DateTime? | Last renewal date (null if never renewed)      |
| isActive      | Boolean   | Whether subscription is active                 |
| autoRenew     | Boolean   | Whether to auto-renew at end date              |
| cancelledAt   | DateTime? | Cancellation date (null if not cancelled)      |
| createdAt     | DateTime  | Creation timestamp                             |
| updatedAt     | DateTime  | Last update timestamp                          |

**Indexes**: 
- `(userId, isActive)` for finding active subscriptions
- `(userId, endDate)` for renewal queries

### 3. `user_quotas`
Tracks monthly free quota usage per user.

| Column     | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | String    | Unique identifier (CUID)       |
| userId     | String    | User identifier                |
| month      | Int       | Month (1-12)                   |
| year       | Int       | Year                           |
| usedCount  | Int       | Number of free messages used   |
| createdAt  | DateTime  | Creation timestamp             |
| updatedAt  | DateTime  | Last update timestamp          |

**Unique Constraint**: `(userId, month, year)` ensures one quota record per user per month.

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Currently, the API uses `userId` in the request body/params for user identification. In a production environment, this would be replaced with proper authentication (JWT tokens, OAuth, etc.).

---

### Health Check

#### `GET /health`

Check if the server is running.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Chat Endpoints

#### `POST /api/chat`

Send a chat message to the AI.

**Request Body**:
```json
{
  "userId": "user1",
  "question": "What is TypeScript?"
}
```

**Success Response** (200):
```json
{
  "answer": "This is a mock response to: \"What is TypeScript?\". The AI would process this query and return a relevant answer.",
  "tokensUsed": 87
}
```

**Error Responses**:

- **400 Bad Request** - Missing or invalid input:
  ```json
  {
    "error": {
      "code": "INVALID_INPUT",
      "message": "userId and question are required"
    }
  }
  ```

- **403 Forbidden** - Quota exceeded:
  ```json
  {
    "error": {
      "code": "QUOTA_EXCEEDED",
      "message": "You have reached your monthly free quota. Please subscribe to continue."
    }
  }
  ```

**Business Logic**:
1. Checks if user has free quota remaining (3 messages/month)
2. If quota exceeded, checks for active subscription with remaining messages
3. Simulates OpenAI API call (1-3 second delay)
4. Deducts from free quota or subscription bundle
5. Saves message to database
6. Returns AI response and token usage

---

### Subscription Endpoints

#### `POST /api/subscriptions`

Create a new subscription bundle.

**Request Body**:
```json
{
  "userId": "user1",
  "type": "Pro",
  "cycle": "monthly",
  "autoRenew": false
}
```

**Parameters**:
- `userId` (string, required): User identifier
- `type` (string, required): Subscription type - `"Basic"`, `"Pro"`, or `"Enterprise"`
- `cycle` (string, optional): Billing cycle - `"monthly"` (default) or `"yearly"`
- `autoRenew` (boolean, optional): Enable auto-renewal (default: `false`)

**Subscription Types**:
- **Basic**: 10 messages/month - $9.99/month or $99.90/year
- **Pro**: 100 messages/month - $49.99/month or $499.90/year
- **Enterprise**: Unlimited messages - $199.99/month or $1999.90/year

**Success Response** (201):
```json
{
  "id": "clx1234567890",
  "userId": "user1",
  "type": "Pro",
  "maxMessages": 100,
  "usedMessages": 0,
  "remainingMessages": 100,
  "price": 49.99,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-02-01T00:00:00.000Z",
  "renewalDate": null,
  "isActive": true,
  "autoRenew": false,
  "cancelledAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses**:

- **400 Bad Request** - Invalid input:
  ```json
  {
    "error": {
      "code": "INVALID_INPUT",
      "message": "type must be one of: Basic, Pro, Enterprise"
    }
  }
  ```

- **402 Payment Required** - Payment failed (10% simulation chance):
  ```json
  {
    "error": {
      "code": "PAYMENT_FAILED",
      "message": "Payment processing failed. Please try again."
    }
  }
  ```

---

#### `GET /api/subscriptions/:userId`

Get all subscription bundles for a user.

**URL Parameters**:
- `userId` (string, required): User identifier

**Success Response** (200):
```json
[
  {
    "id": "clx1234567890",
    "userId": "user1",
    "type": "Pro",
    "maxMessages": 100,
    "usedMessages": 5,
    "remainingMessages": 95,
    "price": 49.99,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-02-01T00:00:00.000Z",
    "renewalDate": null,
    "isActive": true,
    "autoRenew": false,
    "cancelledAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### `PATCH /api/subscriptions/:id/cancel`

Cancel a subscription. The subscription remains valid until the end of the current billing cycle.

**URL Parameters**:
- `id` (string, required): Subscription bundle ID

**Success Response** (200):
```json
{
  "id": "clx1234567890",
  "userId": "user1",
  "type": "Pro",
  "maxMessages": 100,
  "usedMessages": 25,
  "remainingMessages": 75,
  "price": 49.99,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-02-01T00:00:00.000Z",
  "renewalDate": null,
  "isActive": false,
  "autoRenew": false,
  "cancelledAt": "2024-01-15T12:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Responses**:

- **404 Not Found** - Subscription not found:
  ```json
  {
    "error": {
      "code": "SUBSCRIPTION_NOT_FOUND",
      "message": "Subscription not found"
    }
  }
  ```

---

#### `POST /api/subscriptions/:id/renew`

Manually renew a subscription.

**URL Parameters**:
- `id` (string, required): Subscription bundle ID

**Request Body** (optional):
```json
{
  "cycle": "monthly"
}
```

**Parameters**:
- `cycle` (string, optional): Billing cycle - `"monthly"` (default) or `"yearly"`

**Success Response** (200):
```json
{
  "id": "clx1234567890",
  "userId": "user1",
  "type": "Pro",
  "maxMessages": 100,
  "usedMessages": 0,
  "remainingMessages": 100,
  "price": 49.99,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-03-01T00:00:00.000Z",
  "renewalDate": "2024-02-01T10:00:00.000Z",
  "isActive": true,
  "autoRenew": false,
  "cancelledAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-02-01T10:00:00.000Z"
}
```

**Note**: When a subscription is renewed, `usedMessages` is reset to 0, and the `endDate` is extended based on the billing cycle.

**Error Responses**:

- **402 Payment Required** - Payment failed (10% simulation chance)
- **404 Not Found** - Subscription not found

---

## 💼 Business Logic

### Quota Management

1. **Free Quota**:
   - Each user receives 3 free messages per month
   - Quota automatically resets on the 1st of each month
   - Quota is tracked in the `user_quotas` table

2. **Subscription Quota**:
   - After free quota is exhausted, users must have an active subscription
   - System checks for the latest available subscription bundle with remaining messages
   - Messages are deducted from the subscription bundle
   - Multiple active subscriptions are supported (uses the latest one)

3. **Quota Priority**:
   - Free quota is used first
   - Subscription quota is used after free quota is exhausted
   - Enterprise subscriptions have unlimited messages (`null` in database)

### Subscription Management

1. **Subscription Types**:
   - **Basic**: 10 messages per billing cycle - $9.99/month or $99.90/year
   - **Pro**: 100 messages per billing cycle - $49.99/month or $499.90/year
   - **Enterprise**: Unlimited messages - $199.99/month or $1999.90/year

2. **Billing Cycles**:
   - **Monthly**: Subscription lasts 1 month from start/renewal date
   - **Yearly**: Subscription lasts 1 year from start/renewal date (10x monthly price)

3. **Auto-Renewal**:
   - Subscriptions with `autoRenew: true` are automatically renewed at midnight (00:00) daily
   - The cron job checks for subscriptions where `endDate <= today` and `autoRenew: true`
   - Payment is simulated (10% failure chance)
   - On successful payment: subscription is extended, `usedMessages` is reset to 0
   - On payment failure: subscription is marked as inactive (`isActive: false`)

4. **Cancellation**:
   - Cancelled subscriptions remain valid until `endDate`
   - Users can continue using cancelled subscriptions until they expire
   - Cancelled subscriptions do not auto-renew
   - `cancelledAt` timestamp is recorded

5. **Renewal**:
   - Manual renewal extends the subscription from the current `endDate`
   - If `endDate` has passed, renewal starts from the current date
   - `usedMessages` is reset to 0 on renewal
   - `renewalDate` is updated to the current timestamp

### OpenAI Simulation

The chat service simulates OpenAI API calls:

- **Delay**: Random delay between 1-3 seconds to simulate network latency
- **Token Usage**: Random token count between 50-150 tokens per response
- **Response**: Mock response that includes the user's question

In production, this would be replaced with actual OpenAI API integration.

### Payment Simulation

Payment processing is simulated with:

- **Success Rate**: 90% (90% of payments succeed)
- **Failure Rate**: 10% (10% of payments fail randomly)
- **Failure Response**: Returns `402 Payment Required` status code

In production, this would be integrated with a payment gateway (Stripe, PayPal, etc.).

## ⚠️ Error Handling

All errors are returned in a consistent JSON format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Error Codes

| Code                     | HTTP Status | Description                                    |
|--------------------------|-------------|------------------------------------------------|
| `QUOTA_EXCEEDED`         | 403         | User has exceeded free or subscription quota   |
| `SUBSCRIPTION_REQUIRED`  | 403         | User needs an active subscription              |
| `INVALID_SUBSCRIPTION`   | 400         | Subscription is invalid or expired             |
| `SUBSCRIPTION_NOT_FOUND` | 404         | Subscription bundle not found                  |
| `PAYMENT_FAILED`         | 402         | Payment processing failed                      |
| `INVALID_INPUT`          | 400         | Invalid request parameters                     |
| `INTERNAL_ERROR`         | 500         | Unexpected server error                        |

### Error Handler Middleware

The application uses a centralized error handler middleware (`errorHandler.ts`) that:
1. Catches all thrown `AppError` instances
2. Returns structured JSON responses with appropriate status codes
3. Logs unexpected errors to the console
4. Returns generic error messages for internal errors (to avoid exposing sensitive information)

## 🛠 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Lint TypeScript files
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Development Workflow

1. **Make Changes**: Edit files in the `src/` directory
2. **Auto-reload**: `ts-node-dev` automatically restarts the server on file changes
3. **Database Changes**: Update `prisma/schema.prisma`, then run `npm run prisma:migrate`
4. **Test**: Use tools like Postman, cURL, or REST Client extensions to test endpoints

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with TypeScript rules
- **Prettier**: Code formatting
- **Naming**: camelCase for variables/functions, PascalCase for classes

### Testing Auto-Renewal

To test auto-renewal more frequently during development, uncomment the hourly cron job in `src/index.ts`:

```typescript
// Uncomment this in src/index.ts for testing
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly auto-renewal check (development mode)...');
  try {
    await subscriptionService.processAutoRenewals();
  } catch (error) {
    console.error('Error in hourly auto-renewal check:', error);
  }
});
```

This will check for renewals every hour instead of daily at midnight.

## 🚢 Deployment

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set environment variables**:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   PORT=3000
   NODE_ENV=production
   ```

3. **Run database migrations**:
   ```bash
   npm run prisma:migrate deploy
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

### Production Considerations

1. **Environment Variables**: Use a secure secrets management system (AWS Secrets Manager, Azure Key Vault, etc.)
2. **Database**: Use connection pooling for PostgreSQL
3. **Logging**: Implement proper logging (Winston, Pino, etc.)
4. **Monitoring**: Set up application monitoring (New Relic, Datadog, etc.)
5. **Error Tracking**: Integrate error tracking (Sentry, Rollbar, etc.)
6. **Rate Limiting**: Implement rate limiting to prevent abuse
7. **Authentication**: Add proper authentication (JWT, OAuth2, etc.)
8. **HTTPS**: Use HTTPS in production
9. **CORS**: Configure CORS appropriately
10. **Process Manager**: Use PM2, Docker, or Kubernetes for process management

### Docker Deployment (Example)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "start"]
```

### Database Migrations in Production

Always run migrations before deploying:

```bash
npm run prisma:migrate deploy
```

This applies pending migrations without creating new migration files.

## 📝 Additional Notes

### Cron Job Scheduling

The auto-renewal cron job runs daily at midnight (00:00) UTC. The cron expression `'0 0 * * *'` means:
- Minute: 0
- Hour: 0 (midnight)
- Day of month: * (every day)
- Month: * (every month)
- Day of week: * (every day of week)

### Database Seeding

The seed script (`prisma/seed.ts`) creates initial user quotas for development. To customize:

1. Edit `prisma/seed.ts`
2. Run `npm run prisma:seed`

### TypeScript Configuration

The project uses strict TypeScript configuration:
- `strict: true` - Enables all strict type checking options
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused function parameters
- `noImplicitReturns: true` - Error on functions that don't return explicitly

## 📄 License

ISC

## 👥 Author

Backend Assessment Project

---

## 🎓 Learning Resources

### Domain-Driven Design
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [DDD Reference](https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf)

### Clean Architecture
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Express.js
- [Express.js Documentation](https://expressjs.com/)

---

**Happy Coding! 🚀**
