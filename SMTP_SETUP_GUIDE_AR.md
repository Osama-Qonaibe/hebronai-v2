# دليل إعداد البريد الإلكتروني (SMTP) - HebronAI v2

## 📧 كيفية إضافة معلومات البريد الإلكتروني

### الخطوة 1: الحصول على بيانات SMTP

#### الخيار أ: استخدام Gmail (الأسهل والمجاني)

1. **تفعيل المصادقة الثنائية (2FA)**
   - اذهب إلى: https://myaccount.google.com/security
   - فعّل "التحقق بخطوتين" (2-Step Verification)

2. **إنشاء كلمة مرور التطبيق**
   - اذهب إلى: https://myaccount.google.com/apppasswords
   - اختر "Mail" و "Other (Custom name)"
   - اكتب: "HebronAI"
   - انقر "Generate"
   - **احفظ كلمة المرور المكونة من 16 حرف** (ستحتاجها في الخطوة 2)

3. **بياناتك ستكون:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx (كلمة مرور التطبيق)
   ```

#### الخيار ب: استخدام خدمات أخرى

**SendGrid** (مجاني حتى 100 بريد/يوم):
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun** (مجاني حتى 5000 بريد/شهر):
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

**Amazon SES** (رخيص جداً):
```
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

---

### الخطوة 2: إضافة البيانات إلى Vercel

#### الطريقة: عبر Vercel Dashboard (الأسهل)

1. **اذهب إلى Vercel Dashboard**
   - افتح: https://vercel.com/dashboard
   - اختر مشروع `hebronai-v2`

2. **افتح إعدادات المشروع**
   - انقر على "Settings" في الأعلى
   - اختر "Environment Variables" من القائمة الجانبية

3. **أضف المتغيرات واحداً تلو الآخر:**

   انقر "Add New" لكل متغير:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `SMTP_HOST` | `smtp.gmail.com` | Production, Preview, Development |
   | `SMTP_PORT` | `587` | Production, Preview, Development |
   | `SMTP_SECURE` | `false` | Production, Preview, Development |
   | `SMTP_USER` | `your-email@gmail.com` | Production, Preview, Development |
   | `SMTP_PASS` | `xxxx xxxx xxxx xxxx` | Production, Preview, Development |
   | `SMTP_FROM` | `noreply@hebronai.com` | Production, Preview, Development |
   | `SMTP_FROM_NAME` | `HebronAI` | Production, Preview, Development |
   | `CRON_SECRET` | `اكتب أي نص عشوائي طويل` | Production, Preview, Development |

   **ملاحظات مهمة:**
   - ✅ اختر **جميع البيئات** (Production, Preview, Development)
   - ✅ استخدم كلمة مرور التطبيق (App Password) وليس كلمة مرور Gmail العادية
   - ✅ `CRON_SECRET` يمكن أن يكون أي نص عشوائي طويل (مثل: `my-super-secret-cron-key-2024`)

4. **احفظ التغييرات**
   - انقر "Save" لكل متغير

5. **أعد نشر المشروع**
   - اذهب إلى "Deployments"
   - انقر على آخر deployment
   - انقر "Redeploy"
   - انتظر حتى ينتهي النشر (1-2 دقيقة)

---

### الخطوة 3: إضافة مفاتيح الترجمة

يجب إضافة مفاتيح الترجمة لتظهر النصوص بشكل صحيح.

#### 1. افتح ملف الترجمة الإنجليزية

افتح: `messages/en.json`

أضف هذا الكود داخل `"Auth"`:

```json
"Auth": {
  "SignIn": {
    "forgotPassword": "Forgot password?"
  },
  "forgotPassword": {
    "title": "Forgot Password",
    "description": "Enter your email to receive a password reset link",
    "sendResetLink": "Send Reset Link",
    "sending": "Sending...",
    "success": "Reset link sent! Check your email.",
    "error": "Failed to send reset link. Please try again.",
    "checkEmail": "Check Your Email",
    "checkEmailDescription": "We've sent a password reset link to your email address.",
    "backToSignIn": "Back to Sign In"
  },
  "resetPassword": {
    "title": "Reset Password",
    "description": "Enter your new password",
    "newPassword": "New Password",
    "newPasswordPlaceholder": "Enter new password",
    "confirmPassword": "Confirm Password",
    "confirmPasswordPlaceholder": "Confirm new password",
    "resetButton": "Reset Password",
    "resetting": "Resetting...",
    "success": "Password reset successfully!",
    "error": "Failed to reset password. Please try again.",
    "successTitle": "Password Reset Successfully",
    "successDescription": "You can now sign in with your new password.",
    "goToSignIn": "Go to Sign In",
    "errorTitle": "Invalid or Expired Link",
    "invalidToken": "This password reset link is invalid or has expired.",
    "noToken": "No reset token provided.",
    "requestNewLink": "Request New Reset Link",
    "passwordMismatch": "Passwords do not match",
    "passwordTooShort": "Password must be at least 8 characters",
    "passwordRequirements": "Password must be at least 8 characters long"
  }
}
```

#### 2. افتح ملف الترجمة العربية

افتح: `messages/ar.json`

أضف هذا الكود داخل `"Auth"`:

```json
"Auth": {
  "SignIn": {
    "forgotPassword": "نسيت كلمة المرور؟"
  },
  "forgotPassword": {
    "title": "نسيت كلمة المرور",
    "description": "أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور",
    "sendResetLink": "إرسال رابط إعادة التعيين",
    "sending": "جاري الإرسال...",
    "success": "تم إرسال الرابط! تحقق من بريدك الإلكتروني.",
    "error": "فشل إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى.",
    "checkEmail": "تحقق من بريدك الإلكتروني",
    "checkEmailDescription": "لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني.",
    "backToSignIn": "العودة إلى تسجيل الدخول"
  },
  "resetPassword": {
    "title": "إعادة تعيين كلمة المرور",
    "description": "أدخل كلمة المرور الجديدة",
    "newPassword": "كلمة المرور الجديدة",
    "newPasswordPlaceholder": "أدخل كلمة المرور الجديدة",
    "confirmPassword": "تأكيد كلمة المرور",
    "confirmPasswordPlaceholder": "أكد كلمة المرور الجديدة",
    "resetButton": "إعادة تعيين كلمة المرور",
    "resetting": "جاري إعادة التعيين...",
    "success": "تم إعادة تعيين كلمة المرور بنجاح!",
    "error": "فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.",
    "successTitle": "تم إعادة تعيين كلمة المرور بنجاح",
    "successDescription": "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
    "goToSignIn": "الذهاب إلى تسجيل الدخول",
    "errorTitle": "رابط غير صالح أو منتهي الصلاحية",
    "invalidToken": "رابط إعادة تعيين كلمة المرور هذا غير صالح أو منتهي الصلاحية.",
    "noToken": "لم يتم توفير رمز إعادة التعيين.",
    "requestNewLink": "طلب رابط جديد لإعادة التعيين",
    "passwordMismatch": "كلمات المرور غير متطابقة",
    "passwordTooShort": "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    "passwordRequirements": "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
  }
}
```

#### 3. احفظ الملفات وادفعها إلى GitHub

```bash
git add messages/en.json messages/ar.json
git commit -m "Add translation keys for password recovery"
git push origin main
```

---

### الخطوة 4: إعداد Cron Job (اختياري)

لتفعيل تحذيرات انتهاء الاشتراك التلقائية:

#### الطريقة: عبر Vercel Cron

1. **أنشئ ملف `vercel.json` في جذر المشروع**

```json
{
  "crons": [
    {
      "path": "/api/cron/check-expiring-subscriptions",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. **ادفع التغييرات**

```bash
git add vercel.json
git commit -m "Add Vercel cron job for subscription expiration warnings"
git push origin main
```

**ملاحظة:** `0 9 * * *` تعني: كل يوم الساعة 9 صباحاً

---

## ✅ التحقق من أن كل شيء يعمل

### 1. اختبار تسجيل مستخدم جديد
- سجل مستخدم جديد
- يجب أن يصل بريد ترحيب (Welcome Email)

### 2. اختبار نسيت كلمة المرور
- اذهب إلى صفحة تسجيل الدخول
- انقر "نسيت كلمة المرور؟"
- أدخل بريدك الإلكتروني
- يجب أن يصل بريد إعادة تعيين كلمة المرور

### 3. اختبار تفعيل الاشتراك
- قدم طلب اشتراك كمستخدم
- وافق عليه كأدمن
- يجب أن يصل بريد تفعيل الاشتراك للمستخدم

---

## 🔧 حل المشاكل الشائعة

### المشكلة: لا تصل الإيميلات

**الحلول:**
1. تأكد من أن `SMTP_USER` و `SMTP_PASS` صحيحة
2. تأكد من استخدام **كلمة مرور التطبيق** (App Password) وليس كلمة مرور Gmail العادية
3. تحقق من أن المصادقة الثنائية (2FA) مفعلة في Gmail
4. تحقق من مجلد الـ Spam
5. راجع Logs في Vercel Dashboard → Deployments → Functions

### المشكلة: خطأ "Authentication failed"

**الحل:**
- أعد إنشاء كلمة مرور التطبيق من جديد
- تأكد من نسخ كلمة المرور بدون مسافات

### المشكلة: لا يظهر رابط "نسيت كلمة المرور"

**الحل:**
- تأكد من إضافة مفتاح الترجمة `forgotPassword` في `messages/en.json` و `messages/ar.json`
- أعد نشر المشروع على Vercel

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. راجع Logs في Vercel Dashboard
2. تحقق من أن جميع متغيرات البيئة مضافة بشكل صحيح
3. تأكد من أن المشروع تم إعادة نشره بعد إضافة المتغيرات

---

**تم إنشاء هذا الدليل بواسطة Manus AI** 🤖
