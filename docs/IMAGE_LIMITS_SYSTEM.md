# 🖼️ نظام حدود توليد الصور - Image Limits System

## نظرة عامة

نظام محكم ومحمي لإدارة حدود توليد الصور لكل خطة اشتراك.

---

## 📊 الحدود حسب الخطط

| الخطة | الصور/يوم | الصور/شهر | التكلفة |
|-------|-----------|-----------|--------|
| **Free** | 0 | 0 | $0 |
| **Basic** | 3 | 90 | $9.99/شهر |
| **Pro** | 6 | 180 | $24.99/شهر |
| **Enterprise** | ∞ | ∞ | مخصص |

---

## 🏗️ البنية التقنية

### 1. Schema التحديث

```typescript
SubscriptionPlanTable {
  limits: {
    chats: {...},
    messages: {...},
    files: {...},
    images: {               // ← جديد
      maxPerDay: number,
      maxPerMonth: number
    },
    api: {...}
  }
}
```

### 2. جداول التتبع

#### **ImageGenerationTable**
يسجل كل صورة منتجة:
- `userId` - معرف المستخدم
- `prompt` - النص المدخل
- `model` - موديل الذكاء الاصطناعي
- `imageUrl` - رابط الصورة
- `cost` - التكلفة
- `status` - (pending, completed, failed)
- `createdAt` - التاريخ

#### **DailyUsageSummaryTable**
ملخص يومي للاستخدام:
- `userId`
- `date` - اليوم
- `imagesGenerated` - عدد الصور
- `tokensUsed`
- `apiCalls`
- `storageUsedGB`

---

## 🔒 آلية الحماية

### دالة التحقق الرئيسية

```typescript
import { checkImageGenerationLimit } from '@/lib/subscription/image-limits';

// قبل توليد أي صورة
const check = await checkImageGenerationLimit(userId);

if (!check.allowed) {
  return { error: check.reason };
}

// المتابعة بتوليد الصورة...
```

### الاستجابة

```typescript
interface ImageLimitCheck {
  allowed: boolean;          // هل مسموح؟
  reason?: string;           // سبب الرفض
  dailyUsed: number;         // المستخدم اليوم
  dailyLimit: number;        // الحد اليومي
  monthlyUsed: number;       // المستخدم الشهر
  monthlyLimit: number;      // الحد الشهري
}
```

### تسجيل الاستخدام

```typescript
import { recordImageGeneration } from '@/lib/subscription/image-limits';

// بعد نجاح توليد الصورة
await recordImageGeneration(
  userId,
  prompt,
  model,
  cost  // اختياري
);
```

---

## ⚙️ Cron Jobs

### `/api/cron/reset-usage-limits`

يعمل يومياً في منتصف الليل:

#### المهام:
1. ✅ **إنهاء الاشتراكات المنتهية**
   - يفحص `planExpiresAt <= now`
   - يحول لـ `free` plan
   - يضبط `planStatus = "expired"`

2. ✅ **حذف الصور الفاشلة القديمة**
   - يحذف `status = "failed"` أقدم من 30 يوم

3. ✅ **تنظيف سجلات الاستخدام**
   - يحذف `DailyUsageSummary` أقدم من 90 يوم

#### الحماية:
```bash
curl -X POST \
  "https://hebronai.net/api/cron/reset-usage-limits?secret=YOUR_SECRET"
```

---

## 🚀 التكامل مع API توليد الصور

### مثال كامل

```typescript
import { checkImageGenerationLimit, recordImageGeneration } from '@/lib/subscription/image-limits';

export async function POST(request: Request) {
  const { userId, prompt, model } = await request.json();

  // 1. التحقق من الحدود
  const limitCheck = await checkImageGenerationLimit(userId);
  
  if (!limitCheck.allowed) {
    return NextResponse.json(
      { 
        error: limitCheck.reason,
        usage: {
          daily: `${limitCheck.dailyUsed}/${limitCheck.dailyLimit}`,
          monthly: `${limitCheck.monthlyUsed}/${limitCheck.monthlyLimit}`
        }
      },
      { status: 429 }  // Too Many Requests
    );
  }

  // 2. توليد الصورة
  try {
    const imageUrl = await generateImage(prompt, model);
    
    // 3. تسجيل الاستخدام
    await recordImageGeneration(userId, prompt, model, 0.05);
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      remainingToday: limitCheck.dailyLimit - limitCheck.dailyUsed - 1
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}
```

---

## 📝 Migration

### تطبيق على قاعدة البيانات

```bash
# الخطوة 1: تشغيل migration
pnpm db:migrate

# الخطوة 2: التحقق
pnpm tsx scripts/verify-db.ts
```

### SQL Migration

الملف: `0020_add_image_limits_to_plans.sql`

يقوم بـ:
- إضافة `images: { maxPerDay, maxPerMonth }` للخطط الموجودة
- تطبيق الحدود حسب نوع الخطة

---

## 🧪 الاختبار

### 1. اختبار الحدود اليومية

```bash
# توليد 3 صور لمستخدم Basic
for i in {1..3}; do
  curl -X POST https://hebronai.net/api/image/generate \
    -H "Authorization: Bearer TOKEN" \
    -d '{"prompt": "test"}'
done

# الرابعة يجب أن ترفض
curl -X POST https://hebronai.net/api/image/generate \
  -H "Authorization: Bearer TOKEN" \
  -d '{"prompt": "test"}'
# Expected: {"error": "Daily limit reached (3 images/day)"}
```

### 2. اختبار Cron

```bash
curl -X POST \
  "https://hebronai.net/api/cron/reset-usage-limits?secret=YOUR_SECRET"
```

---

## 🔐 الأمان

### ✅ الحماية المطبقة:

1. **التحقق من الاشتراك**
   - يفحص `planStatus = "active"`
   - يفحص `planExpiresAt > now`

2. **الحدود المزدوجة**
   - يومية: تمنع الاستخدام المفرط
   - شهرية: تضمن العدالة

3. **Transaction Safety**
   - استخدام `pgDb.transaction()` لضمان التناسق

4. **Cron Protection**
   - يتطلب `CRON_SECRET` في `.env`

### ⚠️ نقاط الحذر:

- **لا تعرض** `CRON_SECRET` في الكود
- **راقب** تكاليف توليد الصور
- **فعّل** rate limiting على API

---

## 📊 المراقبة

### الاستعلامات المهمة

```sql
-- المستخدمين الأكثر استخداماً للصور
SELECT 
  u.email,
  COUNT(ig.id) as total_images,
  SUM(ig.cost::numeric) as total_cost
FROM image_generation ig
JOIN "user" u ON ig.user_id = u.id
WHERE ig.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.email
ORDER BY total_images DESC
LIMIT 10;

-- استخدام اليوم
SELECT 
  u.email,
  u.plan,
  dus.images_generated,
  dus.date
FROM daily_usage_summary dus
JOIN "user" u ON dus.user_id = u.id
WHERE dus.date = CURRENT_DATE
ORDER BY dus.images_generated DESC;
```

---

## 🎯 الخلاصة

النظام الآن:
- ✅ محمي بحدود يومية وشهرية
- ✅ مدعوم بـ migration تلقائي
- ✅ متكامل مع الـ Cron للتنظيف
- ✅ يتتبع الاستخدام بدقة
- ✅ يمنع التجاوزات والاحتيال

---

**تاريخ التحديث:** 2026-03-05  
**الإصدار:** 2.0  
**المطور:** HebronAI Team
