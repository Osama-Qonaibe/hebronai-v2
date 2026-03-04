# إعداد Cron Jobs على cPanel

## 📋 نظرة عامة

المشروع يحتوي على 4 وظائف Cron Jobs لصيانة التطبيق تلقائياً:

1. **فحص الاشتراكات المنتهية** - إرسال تنبيهات للمستخدمين
2. **تنظيف الكاش** - مسح البيانات المؤقتة كل 3 ساعات
3. **فحص صحة التطبيق** - مراقبة قاعدة البيانات والخدمات
4. **مراقبة الأداء** - تتبع استخدام الموارد والأداء

---

## 🔐 الإعداد المطلوب

### 1. تعيين CRON_SECRET في ملف `.env`

```bash
CRON_SECRET=your-super-secret-key-here-change-this
```

⚠️ **مهم:** غيّر القيمة إلى مفتاح قوي وفريد!

---

## ⚙️ إعداد Cron Jobs في cPanel

### الوصول إلى Cron Jobs:

1. سجل دخول إلى cPanel
2. ابحث عن "Cron Jobs" (المهام المجدولة)
3. اختر "Add New Cron Job"

---

## 📅 الوظائف المطلوبة

### 1️⃣ فحص الاشتراكات المنتهية
**الوقت:** يومياً الساعة 9 صباحاً

```bash
# دقيقة: 0 | ساعة: 9 | يوم: * | شهر: * | يوم الأسبوع: *
0 9 * * * curl -X POST "https://yourdomain.com/api/cron/check-expiring-subscriptions?secret=YOUR_CRON_SECRET" -H "Content-Type: application/json"
```

**البديل (wget):**
```bash
0 9 * * * wget -q -O - "https://yourdomain.com/api/cron/check-expiring-subscriptions?secret=YOUR_CRON_SECRET"
```

---

### 2️⃣ تنظيف الكاش
**الوقت:** كل 3 ساعات

```bash
# دقيقة: 0 | ساعة: */3 | يوم: * | شهر: * | يوم الأسبوع: *
0 */3 * * * curl -X POST "https://yourdomain.com/api/cron/clear-cache?secret=YOUR_CRON_SECRET" -H "Content-Type: application/json"
```

**البديل (wget):**
```bash
0 */3 * * * wget -q -O - "https://yourdomain.com/api/cron/clear-cache?secret=YOUR_CRON_SECRET"
```

---

### 3️⃣ فحص صحة التطبيق
**الوقت:** كل 15 دقيقة

```bash
# دقيقة: */15 | ساعة: * | يوم: * | شهر: * | يوم الأسبوع: *
*/15 * * * * curl -X POST "https://yourdomain.com/api/cron/health-check?secret=YOUR_CRON_SECRET" -H "Content-Type: application/json"
```

**البديل (wget):**
```bash
*/15 * * * * wget -q -O - "https://yourdomain.com/api/cron/health-check?secret=YOUR_CRON_SECRET"
```

---

### 4️⃣ مراقبة الأداء
**الوقت:** كل 30 دقيقة

```bash
# دقيقة: */30 | ساعة: * | يوم: * | شهر: * | يوم الأسبوع: *
*/30 * * * * curl -X POST "https://yourdomain.com/api/cron/performance-monitor?secret=YOUR_CRON_SECRET" -H "Content-Type: application/json"
```

**البديل (wget):**
```bash
*/30 * * * * wget -q -O - "https://yourdomain.com/api/cron/performance-monitor?secret=YOUR_CRON_SECRET"
```

---

## 🔄 التكوين النهائي في cPanel

في واجهة cPanel Cron Jobs:

| الوظيفة | Minute | Hour | Day | Month | Weekday | الأمر |
|---------|--------|------|-----|-------|---------|-------|
| Subscriptions | 0 | 9 | * | * | * | curl command above |
| Clear Cache | 0 | */3 | * | * | * | curl command above |
| Health Check | */15 | * | * | * | * | curl command above |
| Performance | */30 | * | * | * | * | curl command above |

---

## 📧 إعداد الإشعارات (اختياري)

يمكنك إضافة بريد إلكتروني لاستقبال نتائج Cron Jobs:

```bash
MAILTO="your-email@example.com"
0 9 * * * curl ...
```

---

## ✅ التحقق من التشغيل

### 1. اختبار يدوي:
```bash
curl -X POST "https://yourdomain.com/api/cron/health-check?secret=YOUR_CRON_SECRET"
```

### 2. فحص السجلات:
تحقق من ملفات logs في `/var/log/` أو عبر cPanel logs

### 3. مراقبة النتائج:
كل endpoint يرجع JSON response:

```json
{
  "success": true,
  "message": "Operation completed",
  "timestamp": "2026-03-04T18:50:00.000Z"
}
```

---

## 🔒 الأمان

✅ **جميع Endpoints محمية بـ CRON_SECRET**

❌ لن يعمل بدون المفتاح الصحيح:
```json
{ "error": "Unauthorized" }
```

---

## 📊 ما تفعله كل وظيفة

### فحص الاشتراكات:
- يفحص الاشتراكات النشطة
- يرسل إشعارات عند 7، 3، 1 يوم قبل الانتهاء
- يدعم العربية والإنجليزية

### تنظيف الكاش:
- يمسح `usage:*`
- يمسح `user:session:*`
- يمسح `mcp:*`
- يمسح `rate-limit:*`

### فحص الصحة:
- يختبر قاعدة البيانات (PostgreSQL)
- يختبر Redis
- يقيس وقت الاستجابة
- يسجل أي مشاكل

### مراقبة الأداء:
- يراقب زمن الاستعلامات
- يراقب استخدام الذاكرة
- يحسب المستخدمين النشطين
- ينبه عند تباطؤ النظام

---

## ❓ استكشاف الأخطاء

### المشكلة: "Unauthorized"
**الحل:** تأكد من `CRON_SECRET` في `.env` يطابق المستخدم في الأمر

### المشكلة: "Connection refused"
**الحل:** تأكد من أن الـ domain صحيح والتطبيق يعمل

### المشكلة: لا توجد نتائج
**الحل:** تحقق من cPanel Cron Job Logs

---

## 📞 دعم إضافي

للمزيد من المساعدة، راجع:
- [cPanel Cron Jobs Documentation](https://docs.cpanel.net/cpanel/advanced/cron-jobs/)
- سجلات التطبيق في `/logs`
