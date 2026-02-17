# Email Notification System - HebronAI v2

## Overview

A comprehensive email notification system with SMTP integration and professional bilingual (Arabic/English) email templates for HebronAI v2.

## Features

✅ **SMTP Integration** - Nodemailer with configurable SMTP settings
✅ **Bilingual Templates** - Full Arabic (RTL) and English (LTR) support
✅ **Professional Design** - Beautiful, responsive email templates
✅ **Password Recovery** - Complete forgot/reset password flow with better-auth
✅ **Automated Notifications** - Welcome emails, subscription activation, expiration warnings
✅ **Cron Job Support** - Scheduled expiration warnings

## Email Templates

### 1. Welcome Email
- **Trigger**: Sent automatically when a new user signs up
- **Content**: Welcome message, feature overview, call-to-action
- **Languages**: Arabic & English

### 2. Subscription Activated Email
- **Trigger**: Sent when admin approves a subscription request
- **Content**: Confirmation, plan details, expiration date, feature list
- **Languages**: Arabic & English

### 3. Subscription Expiring Email
- **Trigger**: Sent via cron job at 7, 3, and 1 days before expiration
- **Content**: Warning, expiration date, renewal call-to-action
- **Languages**: Arabic & English

### 4. Password Reset Email
- **Trigger**: Sent when user requests password reset
- **Content**: Reset link (expires in 1 hour), security notice
- **Languages**: Arabic & English

## Setup Instructions

### 1. Install Dependencies

The required packages are already added to package.json:

```bash
pnpm install
```

Dependencies:
- `nodemailer` - SMTP email sending
- `@react-email/components` - React-based email templates
- `@react-email/render` - Server-side email rendering

### 2. Configure SMTP Settings

Add the following environment variables to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@hebronai.com
SMTP_FROM_NAME=HebronAI

# Cron Job Secret
CRON_SECRET=your-random-secret-here
```

#### Gmail Setup Example:

1. Go to Google Account Settings → Security
2. Enable 2-Factor Authentication
3. Generate an "App Password" for Mail
4. Use the app password in `SMTP_PASS`

#### Other SMTP Providers:

- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **Amazon SES**: `email-smtp.us-east-1.amazonaws.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`

### 3. Setup Cron Job for Expiration Warnings

#### Option A: Vercel Cron (Recommended for Vercel Deployment)

Add to `vercel.json`:

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

#### Option B: cPanel Cron Job

1. Login to cPanel
2. Go to "Cron Jobs"
3. Add new cron job:
   - **Schedule**: `0 9 * * *` (9 AM daily)
   - **Command**: 
     ```bash
     curl -X POST "https://yourdomain.com/api/cron/check-expiring-subscriptions?secret=YOUR_CRON_SECRET"
     ```

#### Option C: External Cron Service

Use services like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Cronitor](https://cronitor.io)

Configure to call:
```
POST https://yourdomain.com/api/cron/check-expiring-subscriptions
Authorization: Bearer YOUR_CRON_SECRET
```

### 4. Test Email System

#### Test Welcome Email (Development Only)

Create a test endpoint or use the signup flow:

```typescript
import { sendWelcomeEmail } from "@/lib/email/notifications";

await sendWelcomeEmail({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  locale: "en",
});
```

#### Test Password Reset

1. Navigate to `/forgot-password`
2. Enter your email
3. Check your inbox for the reset email
4. Click the link to reset password

#### Test Subscription Activation

1. Create a subscription request as a user
2. Approve it as admin
3. Check user's inbox for activation email

#### Test Expiration Warnings

In development, you can call the cron endpoint directly:

```bash
curl -X POST "http://localhost:3000/api/cron/check-expiring-subscriptions"
```

## File Structure

```
src/
├── lib/
│   └── email/
│       ├── email-service.ts           # Core email service with SMTP
│       ├── notifications.ts           # Helper functions for sending emails
│       └── templates/
│           ├── index.ts
│           ├── welcome-email.tsx
│           ├── subscription-activated-email.tsx
│           ├── subscription-expiring-email.tsx
│           └── password-reset-email.tsx
├── app/
│   ├── (auth)/
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # Forgot password UI
│   │   └── reset-password/
│   │       └── page.tsx              # Reset password UI
│   └── api/
│       └── cron/
│           └── check-expiring-subscriptions/
│               └── route.ts          # Cron job endpoint
└── lib/
    ├── auth/
    │   └── auth-instance.ts          # Updated with password reset
    └── db/
        └── pg/
            └── repositories/
                └── admin-respository.pg.ts  # Updated with email sending
```

## Translation Keys

Add the following keys to your translation files:

### English (`messages/en.json`)

```json
{
  "auth": {
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
}
```

### Arabic (`messages/ar.json`)

```json
{
  "auth": {
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
}
```

## Deployment Checklist

### Before Deploying to Production:

1. ✅ Install dependencies: `pnpm install`
2. ✅ Configure SMTP credentials in production `.env`
3. ✅ Set `CRON_SECRET` in production `.env`
4. ✅ Add translation keys to `messages/en.json` and `messages/ar.json`
5. ✅ Setup cron job for expiration warnings
6. ✅ Test email sending in staging environment
7. ✅ Verify password reset flow works
8. ✅ Check email templates render correctly in different email clients

### Deployment Steps:

#### For Vercel:

```bash
# Push to GitHub
git add .
git commit -m "Add email notification system with SMTP"
git push origin main

# Vercel will auto-deploy
# Add environment variables in Vercel dashboard
```

#### For cPanel:

```bash
# Build the project
pnpm build

# Upload files via FTP/SFTP or Git
# Make sure .env file is updated on server
# Setup cron job in cPanel
# Restart Node.js application
```

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials** - Verify `SMTP_USER` and `SMTP_PASS` are correct
2. **Check firewall** - Ensure port 587 (or 465) is not blocked
3. **Check logs** - Look for errors in application logs
4. **Test SMTP connection** - Use a tool like [SMTP Test Tool](https://www.smtper.net/)

### Gmail "Less Secure Apps" Error

- Gmail no longer supports "less secure apps"
- You MUST use an "App Password" (requires 2FA enabled)
- See: https://support.google.com/accounts/answer/185833

### Password Reset Link Not Working

1. **Check token expiration** - Links expire after 1 hour
2. **Verify BETTER_AUTH_URL** - Must match your domain
3. **Check browser console** - Look for JavaScript errors

### Cron Job Not Running

1. **Verify cron schedule** - Use [crontab.guru](https://crontab.guru/) to validate
2. **Check CRON_SECRET** - Must match in both `.env` and cron command
3. **Test endpoint manually** - Call the API endpoint directly

## Security Considerations

- ✅ SMTP credentials stored in environment variables (never in code)
- ✅ Password reset tokens expire after 1 hour
- ✅ Cron endpoint protected with secret token
- ✅ No sensitive user data in email logs
- ✅ Email sending happens asynchronously (void) to prevent timing attacks

## Future Enhancements

- [ ] Email verification on signup (optional)
- [ ] Email templates for admin notifications
- [ ] Email analytics and tracking
- [ ] Support for more email providers (SendGrid, Mailgun, etc.)
- [ ] Email queue system for high-volume sending
- [ ] Custom email templates via admin panel

## Support

For issues or questions:
- Check logs in `/var/log/` or console
- Review this README
- Contact development team

---

**Last Updated**: February 2026
**Version**: 1.0.0
