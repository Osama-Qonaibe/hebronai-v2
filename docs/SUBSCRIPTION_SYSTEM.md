# Subscription System Documentation

## Overview
Complete subscription and usage tracking system for HebronAI v2.

## Architecture

### Database Schema
- **plan**: Subscription plans with features and pricing
- **user_subscription**: Active subscriptions per user
- **subscription_history**: Audit log of all subscription changes

### Features per Plan
```typescript
{
  maxChatsPerMonth: number | "unlimited",
  maxAgents: number | "unlimited",
  maxWorkflows: number | "unlimited",
  maxMcpServers: number | "unlimited",
  maxFileUploadSizeMB: number,
  customBranding: boolean,
  prioritySupport: boolean,
  apiAccess: boolean,
  webhooks: boolean,
  advancedAnalytics: boolean,
  customDomain: boolean
}
```

## Usage Tracking

### Automatic Tracking
All resource creation endpoints automatically track usage:

```typescript
import { canCreateResource } from "@/lib/permissions/plan-permissions";
import { incrementAgentCount } from "@/lib/usage/usage-tracker";

// Check limit before creation
const check = await canCreateResource(userId, "agents");
if (!check.allowed) {
  return error(check.reason);
}

// Create resource...

// Track usage
await incrementAgentCount(userId);
```

### Resources Tracked
1. **Chats** - Monthly limit, resets every month
2. **Agents** - Total agents created
3. **Workflows** - Total workflows created
4. **MCP Servers** - Total servers connected

## API Endpoints

### Get All Plans
```typescript
GET /api/plans
Response: Plan[]
```

### Get My Subscription
```typescript
GET /api/subscription
Response: { subscription, plan }
```

### Subscribe to Plan
```typescript
POST /api/subscription/subscribe
Body: { planSlug: string, billingCycle: "monthly" | "yearly" }
```

### Get Usage Stats
```typescript
GET /api/usage
Response: {
  chatsThisMonth: number,
  agentsCreated: number,
  workflowsCreated: number,
  mcpServersAdded: number
}
```

## Server Actions

### Subscription Actions
- `getPlans()` - Get all available plans
- `getMySubscription()` - Get current subscription
- `subscribeToPlan(data)` - Subscribe to a plan
- `upgradePlan(slug)` - Upgrade to higher plan
- `downgradePlan(slug)` - Downgrade to lower plan
- `cancelMySubscription()` - Cancel subscription

## Permission Helpers

### Check Resource Limits
```typescript
import { canCreateResource } from "@/lib/permissions/plan-permissions";

const { allowed, reason } = await canCreateResource(userId, "agents");
if (!allowed) {
  // Show error: reason
  // Redirect to /pricing
}
```

### Check Feature Access
```typescript
import { hasFeature } from "@/lib/permissions/plan-permissions";

const canUseAPI = await hasFeature(userId, "apiAccess");
if (!canUseAPI) {
  // Show upgrade prompt
}
```

### Get Remaining Quota
```typescript
import { getRemainingQuota } from "@/lib/permissions/plan-permissions";

const { remaining, total } = await getRemainingQuota(userId, "chats");
// Show: "5 / 50 chats remaining"
```

## UI Components

### Pricing Page
`/pricing` - Public page showing all plans

### Usage Dashboard
`/usage` - User's current usage and limits

### Subscription Management
`/subscription` - Manage active subscription

### Components
- `<PricingCard />` - Display single plan
- `<BillingToggle />` - Switch monthly/yearly
- `<PlanComparison />` - Compare all plans
- `<UsageCard />` - Show resource usage
- `<CancelSubscriptionButton />` - Cancel with confirmation

## Migration

### Run Migration
```bash
pnpm db:push
```

### Seed Plans
```bash
pnpm tsx src/lib/db/seeds/plans.seed.ts
```

## Monthly Reset

### Setup Cron Job
Create a cron job to reset monthly usage:

```typescript
import { resetMonthlyUsage } from "@/lib/usage/usage-tracker";
import { db } from "@/lib/db/pg/db.pg";
import { UserSubscriptionTable } from "@/lib/db/pg/schema.pg";

// Run on 1st of every month
export async function resetAllUsage() {
  const subscriptions = await db.select().from(UserSubscriptionTable);
  
  for (const sub of subscriptions) {
    await resetMonthlyUsage(sub.userId);
  }
}
```

## Integration Checklist

### ✅ Backend
- [x] Database schema
- [x] Migrations
- [x] Repository functions
- [x] Permission helpers
- [x] Usage tracker
- [x] Server actions

### ✅ Frontend
- [x] Pricing page
- [x] Usage dashboard
- [x] Subscription settings
- [x] UI components

### ✅ Integration
- [x] Agent creation limits
- [x] Workflow creation limits
- [x] Chat creation limits
- [x] MCP server limits

## Testing

### Test Plan Limits
1. Subscribe to Free plan
2. Try creating 4 agents (should fail on 4th)
3. Upgrade to Pro plan
4. Create agents unlimited

### Test Usage Tracking
1. Create an agent
2. Check `/usage` - count increased
3. Create another agent
4. Verify count increased again

## Support

For questions or issues, contact the development team.
