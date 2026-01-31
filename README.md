# HebronAI v2

## Quick Start

### Database Setup

```bash
# Run migrations
pnpm db:migrate

# Seed plans (run once after first deployment)
pnpm db:seed:plans
```

### Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build
```

### Deployment

On Vercel:
1. Migrations run automatically during build
2. After first deployment, run: `pnpm db:seed:plans` locally to seed plans
3. Or use Vercel CLI: `vercel exec -- pnpm db:seed:plans`
