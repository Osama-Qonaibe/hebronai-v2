# Deployment Guide for HebronAI v2

## Vercel Deployment with Auto-Migration

### Overview
The project is configured to automatically run database migrations and seed initial data during the build process on Vercel.

### How It Works

1. **Build Command**: `pnpm build`
   - This runs `pnpm db:migrate` first
   - Then runs `next build`

2. **Migration Script**: `scripts/db-migrate.ts`
   - Runs all pending database migrations
   - Automatically seeds plans if they don't exist
   - Exits cleanly for successful deployments

3. **Seed Script**: `src/lib/db/seeds/plans.seed.ts`
   - Checks if plans already exist
   - Only inserts missing plans (idempotent)
   - Safe to run multiple times

### Environment Variables Required on Vercel

Make sure these are set in your Vercel project settings:

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=https://your-domain.vercel.app

# AI APIs (as needed)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Storage (if using)
BLOB_READ_WRITE_TOKEN=...
```

### Deployment Steps

#### 1. Initial Setup on Vercel

1. Connect your GitHub repository to Vercel
2. Set all required environment variables
3. Deploy!

Vercel will automatically:
- Install dependencies
- Run migrations
- Seed plans (if needed)
- Build the Next.js app
- Deploy

#### 2. Subsequent Deployments

Every time you push to `main`:
- Vercel triggers a new build
- Migrations run automatically
- New schema changes are applied
- Plans are re-checked (but not duplicated)

### Manual Migration (Local Development)

```bash
# Run migrations
pnpm db:migrate

# Or just push schema changes
pnpm db:push

# Seed plans manually
pnpm db:seed:plans
```

### Troubleshooting

#### Build Fails with "Migration Error"

**Cause**: Database connection issue or missing env vars

**Solution**:
1. Check `DATABASE_URL` is set correctly in Vercel
2. Ensure database is accessible from Vercel's IP ranges
3. Check Vercel build logs for specific error

#### Plans Not Appearing

**Cause**: Seed script didn't run or failed silently

**Solution**:
1. Check build logs for seed output
2. Manually run seed:
   ```bash
   pnpm db:seed:plans
   ```
3. Verify database connection

#### Migration Takes Too Long

**Cause**: Large schema changes or slow database

**Solution**:
1. Optimize migrations (batch operations)
2. Consider upgrading database plan
3. Run heavy migrations manually before deployment

### Advanced: Custom Migration Workflow

If you want more control:

1. **Remove auto-migration from build**:
   ```json
   // package.json
   "build": "next build"
   ```

2. **Run migrations via Vercel CLI**:
   ```bash
   vercel env pull .env.production
   pnpm db:migrate
   vercel deploy --prod
   ```

3. **Use a separate migration service**:
   - Deploy migrations via GitHub Actions
   - Use a dedicated migration runner
   - Trigger manually before deployment

### Database Schema Updates

When adding new schema changes:

1. **Generate migration**:
   ```bash
   pnpm db:generate
   ```

2. **Test locally**:
   ```bash
   pnpm db:migrate
   ```

3. **Commit & push**:
   ```bash
   git add src/lib/db/migrations
   git commit -m "feat: add new schema"
   git push
   ```

4. **Vercel auto-deploys** and runs migration

### Monitoring

#### Check Migration Status

Look for these logs in Vercel deployment:

```
✅ Running migrations...
✅ Migrations completed!
✅ Checking if plans need seeding...
✅ Plans already exist, skipping seed
```

#### Verify Data

After deployment:

1. Visit `/pricing` - should show all plans
2. Check `/api/plans` - should return plan data
3. Try subscribing to a plan

### Rollback Strategy

If migration breaks production:

1. **Quick fix**: Revert to previous deployment in Vercel
2. **Proper fix**: 
   - Write a down migration
   - Test locally
   - Deploy fix

### Best Practices

1. ✅ **Always test migrations locally first**
2. ✅ **Make migrations backward compatible**
3. ✅ **Use transactions for data migrations**
4. ✅ **Keep seed data idempotent**
5. ✅ **Monitor deployment logs**
6. ✅ **Have a rollback plan**

### CI/CD Integration

For GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '24'
      
      - name: Install
        run: pnpm install
      
      - name: Run Migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: pnpm db:migrate
      
      - name: Deploy to Vercel
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Support

For deployment issues:
- Check Vercel logs
- Review database connection
- Contact dev team

---

**Last Updated**: January 2026
