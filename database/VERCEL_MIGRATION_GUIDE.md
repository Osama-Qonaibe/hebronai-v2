## دليل Migration لقاعدة بيانات Vercel | Vercel Database Migration Guide

---

## 🎯 نظرة عامة | Overview

هذا الدليل يشرح كيفية تطبيق migration على قاعدة بيانات Vercel Postgres للتطوير والاختبار.

This guide explains how to apply migrations to Vercel Postgres database for development and testing.

---

## 📋 المتطلبات | Prerequisites

### 1. **قاعدة بيانات Vercel Postgres**

إذا لم تكن لديك قاعدة بيانات بعد:

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك → **Storage** → **Create Database**
3. اختر **Postgres**
4. اختر المنطقة الأقرب لك
5. انقر **Create**

### 2. **الحصول على DATABASE_URL**

بعد إنشاء قاعدة البيانات:

1. اذهب إلى **Storage** → **Postgres** → اختر قاعدة البيانات
2. انتقل إلى تبويب **Settings**
3. انسخ **`POSTGRES_URL`** أو **`DATABASE_URL`**

---

## 🚀 طرق التنفيذ | Migration Methods

### **الطريقة 1: Drizzle Push (موصى بها للتطوير)**

هذه الطريقة تطبق Schema مباشرة بدون ملفات migration.

```bash
# 1. Clone المستودع (إذا لم تكن قد فعلت)
git clone https://github.com/Osama-Qonaibe/hebronai-v2.git
cd hebronai-v2

# 2. تثبيت التبعيات
pnpm install

# 3. إضافة DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host/db"

# أو إنشاء ملف .env.local
echo "DATABASE_URL=postgresql://user:pass@host/db" > .env.local

# 4. تطبيق Schema
pnpm tsx scripts/db-push.ts
```

**المميزات:**
- ✅ سريع وبسيط
- ✅ مثالي للتطوير
- ✅ لا يتطلب ملفات migration
- ✅ يكتشف التغييرات تلقائياً

**العيوب:**
- ⚠️ لا يحتفظ بتاريخ التغييرات
- ⚠️ غير موصى به للإنتاج

---

### **الطريقة 2: Drizzle Migrate (موصى بها للإنتاج)**

هذه الطريقة تستخدم ملفات migration.

```bash
# 1. توليد ملفات migration
pnpm drizzle-kit generate

# 2. تطبيق migrations
pnpm tsx scripts/migrate.ts
```

**المميزات:**
- ✅ يحتفظ بتاريخ التغييرات
- ✅ آمن للإنتاج
- ✅ يمكن التراجع عن التغييرات
- ✅ تحكم كامل

**العيوب:**
- ⚠️ يتطلب خطوة إضافية (generate)

---

### **الطريقة 3: SQL المباشر (للتحكم الكامل)**

استخدم ملفات SQL التي أنشأناها سابقاً.

```bash
# 1. تثبيت psql (إذا لم يكن مثبتاً)
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql-client
# Windows: Download from postgresql.org

# 2. تطبيق migration
psql "postgresql://user:pass@host/db" -f database/migrations/001_complete_schema.sql
```

---

## 📝 الخطوات التفصيلية | Detailed Steps

### **الخطوة 1: إعداد البيئة**

#### **أ. Clone المستودع**

```bash
git clone https://github.com/Osama-Qonaibe/hebronai-v2.git
cd hebronai-v2
```

#### **ب. تثبيت التبعيات**

```bash
pnpm install
```

#### **ج. إضافة DATABASE_URL**

**الخيار 1: متغير بيئة مؤقت**
```bash
export DATABASE_URL="postgresql://username:password@host:5432/database"
```

**الخيار 2: ملف .env.local (موصى به)**
```bash
# إنشاء ملف .env.local
cat > .env.local << EOF
DATABASE_URL=postgresql://username:password@host:5432/database
POSTGRES_URL=postgresql://username:password@host:5432/database
EOF
```

**الخيار 3: من Vercel CLI**
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع
vercel link

# سحب متغيرات البيئة
vercel env pull .env.local
```

---

### **الخطوة 2: تطبيق Migration**

#### **استخدام Drizzle Push (الأسهل)**

```bash
pnpm tsx scripts/db-push.ts
```

**الناتج المتوقع:**
```
============================================================================
🚀 Drizzle Push - Direct Schema Sync
============================================================================

✅ Database URL found
📍 Target: postgresql://****@****:5432/****

⚠️  WARNING: This will modify your database schema directly!
⚠️  Make sure you have a backup before proceeding.

📦 Running drizzle-kit push...

[Drizzle output...]

============================================================================
✅ Schema pushed successfully!
============================================================================

📊 Summary:
  - Schema: ./src/lib/db/pg/schema.pg.ts
  - Tables: 25
  - Method: Direct push (no migration files)

🎯 Next steps:
  1. Verify tables in your database
  2. Test the application
  3. Create seed data if needed
```

---

### **الخطوة 3: التحقق من النتائج**

```bash
pnpm tsx scripts/verify-db.ts
```

**الناتج المتوقع:**
```
============================================================================
🔍 HebronAI v2 - Database Verification
============================================================================

📍 Connecting to: postgresql://****@****:5432/****

📊 Checking tables...

✅ Found 25 tables (expected: 25)
✅ All expected tables exist!

📑 Checking indexes...
✅ Found 45 indexes

🔗 Checking foreign keys...
✅ Found 38 foreign key constraints

⚡ Checking triggers...
✅ Found 17 triggers

============================================================================
✅ Verification completed!
============================================================================

📊 Summary:
  - Tables: 25/25
  - Indexes: 45
  - Foreign Keys: 38
  - Triggers: 17

✅ Database schema is complete and ready!
```

---

### **الخطوة 4: إضافة بيانات أولية (Seed)**

```bash
pnpm tsx scripts/seed.ts
```

**الناتج المتوقع:**
```
============================================================================
🌱 HebronAI v2 - Database Seeding
============================================================================

📍 Connecting to: postgresql://****@****:5432/****

✅ Connected to database

👤 Creating admin user...
✅ Admin user created
   Email: admin@hebronai.net
   ID: [uuid]

📦 Creating subscription plans...
✅ Created plan: Free Plan
✅ Created plan: Pro Plan

============================================================================
✅ Seeding completed successfully!
============================================================================

📊 Summary:
  - Admin user: admin@hebronai.net
  - Subscription plans: 2 (Free, Pro)
```

---

## 🔧 السكريبتات المتوفرة | Available Scripts

### **1. `db-push.ts`** - تطبيق Schema مباشرة

```bash
pnpm tsx scripts/db-push.ts
```

- ✅ سريع وبسيط
- ✅ مثالي للتطوير
- ⚠️ لا migration files

### **2. `migrate.ts`** - تطبيق migrations

```bash
pnpm tsx scripts/migrate.ts
```

- ✅ آمن للإنتاج
- ✅ يحتفظ بالتاريخ
- ✅ قابل للتراجع

### **3. `verify-db.ts`** - التحقق من قاعدة البيانات

```bash
pnpm tsx scripts/verify-db.ts
```

- ✅ يفحص الجداول
- ✅ يفحص الـ indexes
- ✅ يفحص الـ foreign keys
- ✅ يفحص الـ triggers

### **4. `seed.ts`** - إضافة بيانات أولية

```bash
pnpm tsx scripts/seed.ts
```

- ✅ ينشئ admin user
- ✅ ينشئ subscription plans
- ✅ آمن (لا يكرر البيانات)

---

## 📊 الجداول المُنشأة | Created Tables

بعد تطبيق Migration، ستحصل على **25 جدول**:

### **إدارة المستخدمين | User Management**
1. `user` - المستخدمون
2. `session` - الجلسات
3. `account` - حسابات OAuth
4. `verification` - التحقق وإعادة تعيين كلمة المرور

### **الاشتراكات | Subscriptions**
5. `subscription_plan` - خطط الاشتراك
6. `subscription_request` - طلبات الاشتراك
7. `payment_gateway` - بوابات الدفع

### **المحادثات | Chats**
8. `chat_thread` - المحادثات
9. `chat_message` - الرسائل
10. `chat_export` - تصدير المحادثات
11. `chat_export_comment` - التعليقات

### **الذكاء الاصطناعي | AI Features**
12. `agent` - الوكلاء الذكيون
13. `mcp_server` - خوادم MCP
14. `mcp_server_tool_custom_instructions` - تخصيص أدوات MCP
15. `mcp_server_custom_instructions` - تخصيص خوادم MCP
16. `mcp_oauth_session` - جلسات OAuth

### **سير العمل | Workflows**
17. `workflow` - سير العمل
18. `workflow_node` - العقد
19. `workflow_edge` - الروابط

### **التنظيم | Organization**
20. `bookmark` - الإشارات المرجعية
21. `archive` - الأرشيف
22. `archive_item` - عناصر الأرشيف

### **التحليلات | Analytics**
23. `usage` - تتبع الاستخدام
24. `image_generation` - توليد الصور
25. `daily_usage_summary` - الملخص اليومي

---

## 🔍 استكشاف الأخطاء | Troubleshooting

### **خطأ: "DATABASE_URL not set"**

```bash
# تأكد من إضافة DATABASE_URL
echo $DATABASE_URL

# إذا كان فارغاً، أضفه:
export DATABASE_URL="postgresql://user:pass@host/db"
```

### **خطأ: "ECONNREFUSED"**

- ✅ تحقق من أن DATABASE_URL صحيح
- ✅ تحقق من أن قاعدة البيانات تعمل
- ✅ تحقق من إعدادات Firewall

### **خطأ: "authentication failed"**

- ✅ تحقق من اسم المستخدم وكلمة المرور
- ✅ تأكد من أن DATABASE_URL كامل
- ✅ جرب نسخ DATABASE_URL مرة أخرى من Vercel

### **خطأ: "database does not exist"**

- ✅ تأكد من إنشاء قاعدة البيانات في Vercel
- ✅ تحقق من اسم قاعدة البيانات في URL

### **خطأ: "relation already exists"**

الجداول موجودة بالفعل. خيارات:

**الخيار 1: حذف الجداول القديمة**
```bash
psql "$DATABASE_URL" -f database/migrations/001_rollback.sql
```

**الخيار 2: إنشاء قاعدة بيانات جديدة**
- أنشئ قاعدة بيانات جديدة في Vercel
- استخدم DATABASE_URL الجديد

---

## 🎯 الخطوات التالية | Next Steps

بعد تطبيق Migration بنجاح:

### **1. تحديث Vercel Environment Variables**

```bash
# في Vercel Dashboard:
# Settings → Environment Variables → Add

DATABASE_URL=postgresql://user:pass@host/db
POSTGRES_URL=postgresql://user:pass@host/db
```

### **2. إعادة نشر التطبيق**

```bash
git push origin main
# Vercel سيُعيد النشر تلقائياً
```

### **3. اختبار التطبيق**

- ✅ سجل دخول كـ admin
- ✅ أنشئ محادثة جديدة
- ✅ جرب جميع الميزات

---

## 📚 الأوامر السريعة | Quick Commands

```bash
# تطبيق Schema (التطوير)
pnpm tsx scripts/db-push.ts

# التحقق من قاعدة البيانات
pnpm tsx scripts/verify-db.ts

# إضافة بيانات أولية
pnpm tsx scripts/seed.ts

# تطبيق migrations (الإنتاج)
pnpm drizzle-kit generate
pnpm tsx scripts/migrate.ts

# التراجع عن جميع التغييرات
psql "$DATABASE_URL" -f database/migrations/001_rollback.sql
```

---

## ⚡ نصائح للأداء | Performance Tips

### **1. استخدام Connection Pooling**

```typescript
// في production، استخدم:
const sql = postgres(databaseUrl, { 
  max: 10,  // عدد الاتصالات
  idle_timeout: 20,
  connect_timeout: 10,
});
```

### **2. إنشاء Indexes إضافية**

```sql
-- إذا كنت تبحث كثيراً بالبريد الإلكتروني
CREATE INDEX IF NOT EXISTS user_email_idx ON "user"(email);

-- إذا كنت تبحث كثيراً بالتاريخ
CREATE INDEX IF NOT EXISTS chat_created_at_idx ON chat_thread(created_at DESC);
```

### **3. تفعيل Query Logging (للتطوير فقط)**

```typescript
const sql = postgres(databaseUrl, { 
  debug: true,  // يعرض جميع الـ queries
});
```

---

## 🔒 الأمان | Security

### **1. لا تشارك DATABASE_URL**

- ❌ لا تضعه في Git
- ❌ لا تشاركه في الرسائل
- ✅ استخدم `.env.local` (مُستثنى من Git)

### **2. استخدام Read-Only للتطوير**

في Vercel، يمكنك إنشاء connection string للقراءة فقط:

```bash
# في .env.local
DATABASE_URL=postgresql://readonly_user:pass@host/db
```

### **3. تفعيل SSL**

```typescript
const sql = postgres(databaseUrl, { 
  ssl: 'require',  // يفرض SSL
});
```

---

## 📞 الدعم | Support

إذا واجهت أي مشاكل:

1. **تحقق من Logs:**
```bash
pnpm tsx scripts/verify-db.ts
```

2. **اختبر الاتصال:**
```bash
psql "$DATABASE_URL" -c "SELECT version();"
```

3. **راجع Vercel Logs:**
- Vercel Dashboard → Project → Deployments → Logs

---

## ✅ Checklist

- [ ] تثبيت التبعيات (`pnpm install`)
- [ ] إضافة DATABASE_URL
- [ ] تطبيق Migration (`pnpm tsx scripts/db-push.ts`)
- [ ] التحقق من النتائج (`pnpm tsx scripts/verify-db.ts`)
- [ ] إضافة بيانات أولية (`pnpm tsx scripts/seed.ts`)
- [ ] تحديث Vercel Environment Variables
- [ ] إعادة نشر التطبيق
- [ ] اختبار التطبيق

---

**تم إنشاء هذا الدليل بواسطة:** Manus AI  
**التاريخ:** 21 فبراير 2026  
**الإصدار:** HebronAI v3.4.0
