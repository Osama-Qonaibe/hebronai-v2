# Plan Migration Guide

## Overview
This guide explains how to migrate from the old hardcoded plan system to the new dynamic subscription plan system with foreign keys.

## Changes Made

### 1. Schema Updates
- **UserTable**: Added `planId` (UUID) with FK to `SubscriptionPlanTable`
- **SubscriptionRequestTable**: Added `requestedPlanId` (UUID) with FK to `SubscriptionPlanTable`
- Old `plan` (enum) column kept for backward compatibility

### 2. Migration Steps

#### Step 1: Run Database Migration
```bash
# Apply SQL migration
psql $DATABASE_URL -f drizzle/0001_add_plan_foreign_keys.sql

# OR use your migration tool
npm run db:migrate
```

#### Step 2: Seed Default Plans
```bash
curl -X POST https://your-domain.com/api/admin/seed-plans \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

This creates 3 default plans:
- Free (slug: `free`)
- Pro (slug: `pro`)
- Enterprise (slug: `enterprise`)

#### Step 3: Migrate Existing Users
```bash
tsx scripts/migrate-plans.ts
```

This script:
1. Fetches all subscription plans
2. Maps old `plan` enum values to new `planId` UUIDs
3. Updates all users with correct `planId`

### 3. Benefits

#### Before (Old System)
```typescript
// ❌ Hardcoded enum
plan: varchar("plan", {
  enum: ["free", "basic", "pro", "enterprise"],
})
```

**Problems:**
- Can't add new plans without code changes
- Can't modify plan details dynamically
- No admin control

#### After (New System)
```typescript
// ✅ Dynamic foreign key
planId: uuid("plan_id")
  .references(() => SubscriptionPlanTable.id)
```

**Benefits:**
- ✅ Add/edit plans via Admin Panel
- ✅ Full plan details (pricing, features, limits)
- ✅ Referential integrity
- ✅ Better queries with JOINs
- ✅ Future-proof

### 4. Usage Examples

#### Get User's Plan Details
```typescript
const user = await pgDb
  .select({
    user: UserTable,
    plan: SubscriptionPlanTable,
  })
  .from(UserTable)
  .leftJoin(SubscriptionPlanTable, eq(UserTable.planId, SubscriptionPlanTable.id))
  .where(eq(UserTable.id, userId))
  .execute();

console.log(user.plan.features.advanced.imageGeneration); // true/false
console.log(user.plan.limits.chats.maxActive); // 50
```

#### Update User's Plan
```typescript
const proPlan = await pgDb
  .select()
  .from(SubscriptionPlanTable)
  .where(eq(SubscriptionPlanTable.slug, "pro"))
  .limit(1);

await pgDb
  .update(UserTable)
  .set({ 
    planId: proPlan[0].id,
    planStatus: "active",
  })
  .where(eq(UserTable.id, userId));
```

### 5. Backward Compatibility

The old `plan` enum column is kept temporarily:
- Existing code still works
- Gradual migration possible
- Can be removed after full migration

### 6. Next Steps

1. ✅ Run migrations (Steps 1-3)
2. ✅ Test in development
3. 📦 Update frontend to use `/api/plans`
4. 🔒 Update auth/middleware to check `planId`
5. 📋 Build Admin Panel for plan management
6. ♻️ Remove old `plan` column (future)

### 7. Rollback (if needed)

```sql
-- Remove new columns
ALTER TABLE "user" DROP COLUMN "plan_id";
ALTER TABLE "subscription_request" DROP COLUMN "requested_plan_id";

-- Drop indexes
DROP INDEX "user_plan_id_idx";
DROP INDEX "subscription_request_requested_plan_id_idx";
```

---

## Support

If you encounter issues:
1. Check database logs
2. Verify plans exist in `subscription_plan` table
3. Run migration script with `--verbose` flag
4. Contact admin support
