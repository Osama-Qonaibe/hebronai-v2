import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import logger from "logger";

// SMTP Configuration from environment variables
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

const FROM_EMAIL =
  process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@hebronai.com";
const FROM_NAME = process.env.SMTP_FROM_NAME || "HebronAI";

// Create reusable transporter
const createTransporter = () => {
  if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
    logger.warn("SMTP credentials not configured. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport(SMTP_CONFIG);
};

export interface EmailOptions {
  to: string;
  subject: string;
  template: React.ReactElement;
  locale?: "en" | "ar";
}

export const sendEmail = async ({
  to,
  subject,
  template,
  locale = "en",
}: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      logger.error("Email transporter not configured");
      return false;
    }

    // Render React component to HTML
    const html = await render(template);

    // Send email
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error("Failed to send email:", error);
    return false;
  }
};

// Helper function to get email subject based on locale
export const getEmailSubject = (key: string, locale: "en" | "ar"): string => {
  const subjects: Record<string, Record<"en" | "ar", string>> = {
    welcome: {
      en: "Welcome to HebronAI! 🚀",
      ar: "مرحباً بك في HebronAI! 🚀",
    },
    subscriptionActivated: {
      en: "Your Subscription Has Been Activated! ✅",
      ar: "تم تفعيل اشتراكك! ✅",
    },
    subscriptionExpiring: {
      en: "Your Subscription is Expiring Soon ⏰",
      ar: "اشتراكك على وشك الانتهاء ⏰",
    },
    subscriptionExpired: {
      en: "Your Subscription Has Expired",
      ar: "انتهى اشتراكك",
    },
    passwordReset: {
      en: "Reset Your Password - HebronAI",
      ar: "إعادة تعيين كلمة المرور - HebronAI",
    },
  };

  return subjects[key]?.[locale] || subjects[key]?.en || key;
};
