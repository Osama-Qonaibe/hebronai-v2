# دليل تنفيذ Migration لقاعدة البيانات | Database Migration Guide

## 📋 نظرة عامة | Overview

هذا الدليل يشرح كيفية تنفيذ migration كامل لقاعدة بيانات HebronAI v2 من خلال cPanel Terminal.

This guide explains how to execute a complete database migration for HebronAI v2 through cPanel Terminal.

---

## 🗂️ الملفات المتوفرة | Available Files

```
database/
├── migrations/
│   ├── 001_complete_schema.sql    # Full database schema
│   └── 001_rollback.sql           # Rollback script (drops all tables)
└── MIGRATION_GUIDE.md             # This guide
```

---

## 📊 الجداول المشمولة | Included Tables

Migration يتضمن **25 جدول** كامل:

1. **subscription_plan** - خطط الاشتراك
2. **user** - المستخدمون
3. **payment_gateway** - بوابات الدفع
4. **subscription_request** - طلبات الاشتراك
5. **session** - جلسات المستخدمين
6. **account** - حسابات OAuth
7. **verification** - التحقق من البريد الإلكتروني وإعادة تعيين كلمة المرور
8. **chat_thread** - محادثات
9. **chat_message** - رسائل المحادثات
10. **agent** - الوكلاء الذكيون
11. **mcp_server** - خوادم MCP
12. **mcp_server_tool_custom_instructions** - تخصيص أدوات MCP
13. **mcp_server_custom_instructions** - تخصيص خوادم MCP
14. **mcp_oauth_session** - جلسات OAuth لـ MCP
15. **workflow** - سير العمل
16. **workflow_node** - عقد سير العمل
17. **workflow_edge** - روابط سير العمل
18. **bookmark** - الإشارات المرجعية
19. **archive** - الأرشيف
20. **archive_item** - عناصر الأرشيف
21. **chat_export** - تصدير المحادثات
22. **chat_export_comment** - تعليقات المحادثات المصدرة
23. **usage** - تتبع الاستخدام
24. **image_generation** - توليد الصور
25. **daily_usage_summary** - ملخص الاستخدام اليومي

---

## 🚀 طريقة التنفيذ | Execution Method

### الخطوة 1: الوصول إلى cPanel Terminal

1. سجل الدخول إلى **cPanel**
2. ابحث عن **Terminal** في قسم Advanced
3. انقر لفتح Terminal

### Step 1: Access cPanel Terminal

1. Log in to **cPanel**
2. Find **Terminal** in the Advanced section
3. Click to open Terminal

---

### الخطوة 2: رفع ملفات Migration

#### الطريقة الأولى: استخدام Git (موصى بها)

```bash
# Clone the repository
cd ~
git clone https://github.com/Osama-Qonaibe/hebronai-v2.git
cd hebronai-v2/database/migrations
```

#### الطريقة الثانية: رفع يدوي عبر File Manager

1. افتح **File Manager** في cPanel
2. انتقل إلى المجلد الرئيسي
3. أنشئ مجلد `database/migrations`
4. ارفع الملفات:
   - `001_complete_schema.sql`
   - `001_rollback.sql`

---

### الخطوة 3: الحصول على بيانات الاتصال بقاعدة البيانات

ستحتاج إلى:
- **اسم قاعدة البيانات** (Database Name)
- **اسم المستخدم** (Username)
- **كلمة المرور** (Password)
- **المضيف** (Host) - عادة `localhost`

You will need:
- **Database Name**
- **Username**
- **Password**
- **Host** - usually `localhost`

---

### الخطوة 4: تنفيذ Migration

#### الطريقة 1: استخدام psql (PostgreSQL)

```bash
# Navigate to migrations directory
cd ~/hebronai-v2/database/migrations

# Execute the migration
psql -h localhost -U your_username -d your_database_name -f 001_complete_schema.sql

# Enter password when prompted
```

#### الطريقة 2: استخدام mysql (إذا كنت تستخدم MySQL بدلاً من PostgreSQL)

```bash
# Navigate to migrations directory
cd ~/hebronai-v2/database/migrations

# Execute the migration
mysql -h localhost -u your_username -p your_database_name < 001_complete_schema.sql

# Enter password when prompted
```

---

### الخطوة 5: التحقق من نجاح Migration

```bash
# For PostgreSQL
psql -h localhost -U your_username -d your_database_name -c "\dt"

# For MySQL
mysql -h localhost -u your_username -p your_database_name -e "SHOW TABLES;"
```

يجب أن ترى **25 جدول** في القائمة.

You should see **25 tables** in the list.

---

## 🔄 Rollback (التراجع عن Migration)

⚠️ **تحذير:** هذا سيحذف جميع البيانات بشكل دائم!

⚠️ **WARNING:** This will permanently delete ALL data!

```bash
# For PostgreSQL
psql -h localhost -U your_username -d your_database_name -f 001_rollback.sql

# For MySQL
mysql -h localhost -u your_username -p your_database_name < 001_rollback.sql
```

---

## 📝 ملاحظات مهمة | Important Notes

### 1. **النسخ الاحتياطي | Backup**

⚠️ **قبل تنفيذ Migration، قم بعمل نسخة احتياطية من قاعدة البيانات!**

```bash
# PostgreSQL backup
pg_dump -h localhost -U your_username your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# MySQL backup
mysqldump -h localhost -u your_username -p your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. **الصلاحيات | Permissions**

تأكد من أن المستخدم لديه صلاحيات:
- `CREATE TABLE`
- `CREATE INDEX`
- `CREATE TRIGGER`
- `CREATE FUNCTION`

Ensure the user has permissions for:
- `CREATE TABLE`
- `CREATE INDEX`
- `CREATE TRIGGER`
- `CREATE FUNCTION`

### 3. **UUID Extension**

Migration يتطلب PostgreSQL UUID extension. إذا لم يكن مثبتاً:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 4. **قاعدة البيانات الموجودة | Existing Database**

إذا كانت قاعدة البيانات تحتوي على جداول بالفعل:

**الخيار 1:** حذف الجداول القديمة يدوياً
```sql
DROP TABLE IF EXISTS old_table_name CASCADE;
```

**الخيار 2:** إنشاء قاعدة بيانات جديدة
```sql
CREATE DATABASE hebronai_v2_new;
```

---

## 🔍 استكشاف الأخطاء | Troubleshooting

### خطأ: "permission denied"

```bash
# Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
```

### خطأ: "relation already exists"

الجدول موجود بالفعل. خيارات:

1. حذف الجدول القديم:
```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

2. تخطي الخطأ والمتابعة (إذا كان الجدول صحيحاً)

### خطأ: "function uuid_generate_v4() does not exist"

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### خطأ: "could not connect to server"

تحقق من:
- اسم المضيف (Host) صحيح
- المنفذ (Port) صحيح (5432 لـ PostgreSQL، 3306 لـ MySQL)
- اسم المستخدم وكلمة المرور صحيحة
- قاعدة البيانات موجودة

---

## 📞 الدعم | Support

إذا واجهت أي مشاكل:

1. تحقق من logs:
```bash
# PostgreSQL logs
tail -f /var/log/postgresql/postgresql-*.log

# MySQL logs
tail -f /var/log/mysql/error.log
```

2. تحقق من الاتصال:
```bash
# PostgreSQL
psql -h localhost -U your_username -d your_database_name -c "SELECT version();"

# MySQL
mysql -h localhost -u your_username -p -e "SELECT version();"
```

3. راجع الأخطاء في ملف Migration

---

## ✅ التحقق النهائي | Final Verification

بعد تنفيذ Migration بنجاح:

```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';  -- Should return 25

-- Check indexes
SELECT COUNT(*) FROM pg_indexes 
WHERE schemaname = 'public';

-- Check triggers
SELECT COUNT(*) FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

---

## 🎯 الخطوات التالية | Next Steps

بعد تنفيذ Migration:

1. ✅ تحديث متغيرات البيئة في Vercel:
   - `DATABASE_URL`
   - `DIRECT_URL` (إذا كنت تستخدم connection pooling)

2. ✅ إعادة نشر التطبيق على Vercel

3. ✅ اختبار الاتصال بقاعدة البيانات

4. ✅ إنشاء مستخدم admin أول:
```sql
INSERT INTO "user" (name, email, email_verified, role, plan, plan_status)
VALUES ('Admin', 'admin@hebronai.net', true, 'admin', 'enterprise', 'active');
```

---

## 📚 مراجع إضافية | Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://www.better-auth.com/)

---

**تم إنشاء هذا الدليل بواسطة:** Manus AI  
**التاريخ:** 17 فبراير 2026  
**الإصدار:** HebronAI v3.4.0
