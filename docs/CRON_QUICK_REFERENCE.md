# Cron Jobs - Quick Reference

## 🚀 Quick Setup Commands

Replace `YOUR_CRON_SECRET` and `yourdomain.com` with your actual values.

### Daily - Check Expiring Subscriptions (9 AM)
```bash
0 9 * * * curl -X POST "https://yourdomain.com/api/cron/check-expiring-subscriptions?secret=YOUR_CRON_SECRET"
```

### Every 3 Hours - Clear Cache
```bash
0 */3 * * * curl -X POST "https://yourdomain.com/api/cron/clear-cache?secret=YOUR_CRON_SECRET"
```

### Every 15 Minutes - Health Check
```bash
*/15 * * * * curl -X POST "https://yourdomain.com/api/cron/health-check?secret=YOUR_CRON_SECRET"
```

### Every 30 Minutes - Performance Monitor
```bash
*/30 * * * * curl -X POST "https://yourdomain.com/api/cron/performance-monitor?secret=YOUR_CRON_SECRET"
```

---

## 🔑 Environment Variable

Add to `.env`:
```
CRON_SECRET=your-super-secret-key-change-this
```

---

## ✅ Test Commands

```bash
# Test health check
curl -X POST "https://yourdomain.com/api/cron/health-check?secret=YOUR_CRON_SECRET"

# Test cache clearing
curl -X POST "https://yourdomain.com/api/cron/clear-cache?secret=YOUR_CRON_SECRET"

# Test performance monitor
curl -X POST "https://yourdomain.com/api/cron/performance-monitor?secret=YOUR_CRON_SECRET"

# Test subscription check
curl -X POST "https://yourdomain.com/api/cron/check-expiring-subscriptions?secret=YOUR_CRON_SECRET"
```

---

## 📊 What Each Job Does

| Job | Frequency | Purpose |
|-----|-----------|----------|
| **Subscriptions** | Daily 9 AM | Send expiration warnings (7, 3, 1 days) |
| **Clear Cache** | Every 3 hours | Remove temporary data from Redis |
| **Health Check** | Every 15 min | Monitor database & services |
| **Performance** | Every 30 min | Track resource usage & slow queries |

---

For detailed setup instructions, see [CRON_SETUP.md](./CRON_SETUP.md)
