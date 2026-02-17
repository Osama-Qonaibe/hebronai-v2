# إعداد البريد الإلكتروني لـ HebronAI
## بريد الأعمال: info@hebronai.net

---

## 🎯 بيانات SMTP الخاصة بك

بناءً على معلومات البريد الإلكتروني الخاص بك، إليك البيانات الصحيحة:

```
البريد الإلكتروني: info@hebronai.net
الخادم: mail.hebronai.net
SMTP Port: 465 (SSL/TLS)
المصادقة: مطلوبة
```

---

## 📋 الخطوة 1: إضافة المتغيرات في Vercel

### اذهب إلى Vercel Dashboard:
1. افتح: https://vercel.com/dashboard
2. اختر مشروع **hebronai-v2**
3. انقر على **Settings** (في الأعلى)
4. اختر **Environment Variables** من القائمة الجانبية

### أضف هذه المتغيرات واحداً تلو الآخر:

انقر **"Add New"** لكل متغير:

| Name | Value | Environment |
|------|-------|-------------|
| `SMTP_HOST` | `mail.hebronai.net` | ✅ Production, Preview, Development |
| `SMTP_PORT` | `465` | ✅ Production, Preview, Development |
| `SMTP_SECURE` | `true` | ✅ Production, Preview, Development |
| `SMTP_USER` | `info@hebronai.net` | ✅ Production, Preview, Development |
| `SMTP_PASS` | `كلمة المرور الخاصة بالبريد` | ✅ Production, Preview, Development |
| `SMTP_FROM` | `info@hebronai.net` | ✅ Production, Preview, Development |
| `SMTP_FROM_NAME` | `HebronAI` | ✅ Production, Preview, Development |
| `CRON_SECRET` | `hebronai-cron-secret-2024-secure` | ✅ Production, Preview, Development |

### ⚠️ ملاحظات مهمة:

1. **SMTP_SECURE = true** (لأننا نستخدم Port 465 مع SSL/TLS)
2. **SMTP_PASS**: استخدم كلمة المرور الخاصة بحساب `info@hebronai.net`
3. **اختر جميع البيئات**: Production, Preview, Development
4. **CRON_SECRET**: يمكنك استخدام القيمة المقترحة أو أي نص عشوائي آخر

---

## 📋 الخطوة 2: إعادة نشر المشروع

بعد إضافة جميع المتغيرات:

1. اذهب إلى **Deployments** في Vercel
2. انقر على آخر deployment
3. انقر على **"Redeploy"**
4. انتظر حتى ينتهي النشر (1-2 دقيقة)

---

## 📋 الخطوة 3: إضافة مفاتيح الترجمة

### في ملف `messages/en.json`:

أضف داخل `"Auth"`:

```json
"Auth": {
  "SignIn": {
    "title": "Sign In",
    "description": "Enter your credentials to access your account",
    "signIn": "Sign In",
    "orContinueWith": "Or continue with",
    "noAccount": "Don't have an account? ",
    "signUp": "Sign up",
    "forgotPassword": "Forgot password?"
  },
  "forgotPassword": {
    "title": "Forgot Password",
    "description": "Enter your email to receive a password reset link",
    "email": "Email",
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
    "passwordRequirements": "Password must be at least 8 characters long",
    "showPassword": "Show password",
    "hidePassword": "Hide password"
  }
}
```

### في ملف `messages/ar.json`:

أضف داخل `"Auth"`:

```json
"Auth": {
  "SignIn": {
    "title": "تسجيل الدخول",
    "description": "أدخل بياناتك للوصول إلى حسابك",
    "signIn": "تسجيل الدخول",
    "orContinueWith": "أو تابع باستخدام",
    "noAccount": "ليس لديك حساب؟ ",
    "signUp": "سجل الآن",
    "forgotPassword": "نسيت كلمة المرور؟"
  },
  "forgotPassword": {
    "title": "نسيت كلمة المرور",
    "description": "أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور",
    "email": "البريد الإلكتروني",
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
    "passwordRequirements": "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    "showPassword": "إظهار كلمة المرور",
    "hidePassword": "إخفاء كلمة المرور"
  }
}
```

### ادفع التغييرات إلى GitHub:

```bash
git add messages/en.json messages/ar.json
git commit -m "Add translation keys for password recovery"
git push origin main
```

---

## ✅ اختبار النظام

بعد إضافة المتغيرات وإعادة النشر، اختبر:

### 1. اختبار تسجيل مستخدم جديد
- سجل مستخدم جديد
- يجب أن يصل بريد ترحيب من `info@hebronai.net`

### 2. اختبار نسيت كلمة المرور
- اذهب إلى صفحة تسجيل الدخول
- انقر "نسيت كلمة المرور؟"
- أدخل بريدك الإلكتروني
- يجب أن يصل بريد إعادة تعيين من `info@hebronai.net`

### 3. اختبار تفعيل الاشتراك
- قدم طلب اشتراك كمستخدم
- وافق عليه كأدمن
- يجب أن يصل بريد تفعيل من `info@hebronai.net`

---

## 🔧 حل المشاكل

### المشكلة: لا تصل الإيميلات

**الحلول:**

1. **تحقق من كلمة المرور:**
   - تأكد من استخدام كلمة المرور الصحيحة لحساب `info@hebronai.net`
   - جرب تسجيل الدخول يدوياً في webmail للتأكد

2. **تحقق من إعدادات SMTP:**
   - تأكد من أن `SMTP_SECURE = true`
   - تأكد من أن `SMTP_PORT = 465`

3. **تحقق من Firewall:**
   - تأكد من أن Port 465 غير محظور في الاستضافة

4. **راجع Logs في Vercel:**
   - Vercel Dashboard → Deployments → Functions
   - ابحث عن أخطاء SMTP

### المشكلة: خطأ "Authentication failed"

**الحل:**
- أعد كتابة كلمة المرور في Vercel
- تأكد من عدم وجود مسافات في البداية أو النهاية

### المشكلة: الإيميلات تذهب إلى Spam

**الحل:**
- أضف SPF Record في DNS:
  ```
  v=spf1 a mx ip4:YOUR_SERVER_IP ~all
  ```
- أضف DKIM Record (اطلبه من مزود الاستضافة)

---

## 📊 ملخص الإعداد

### ✅ ما تم إنجازه:
- ✅ نظام SMTP كامل مع 4 قوالب بريد
- ✅ صفحات استعادة كلمة المرور
- ✅ رابط "نسيت كلمة المرور" في صفحة تسجيل الدخول
- ✅ تكامل تلقائي مع النظام

### ⏳ ما يجب فعله:
1. ⏳ إضافة متغيرات SMTP في Vercel (الخطوة 1)
2. ⏳ إعادة نشر المشروع (الخطوة 2)
3. ⏳ إضافة مفاتيح الترجمة (الخطوة 3)
4. ⏳ اختبار النظام

---

## 🎯 النتيجة النهائية

بعد إكمال الخطوات أعلاه، سيعمل النظام تلقائياً:

✉️ **بريد الترحيب** - عند تسجيل مستخدم جديد
🔐 **بريد استعادة كلمة المرور** - عند طلب إعادة التعيين
✅ **بريد تفعيل الاشتراك** - عند موافقة الأدمن
⏰ **تحذيرات الانتهاء** - قبل 7، 3، 1 يوم (مع Cron Job)

**جميع الإيميلات ستُرسل من:** `info@hebronai.net` ✅

---

**تم إنشاء هذا الدليل خصيصاً لـ HebronAI** 🚀
