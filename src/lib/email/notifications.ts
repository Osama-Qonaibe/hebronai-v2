import { sendEmail, getEmailSubject } from "./email-service";
import {
  WelcomeEmail,
  SubscriptionActivatedEmail,
  SubscriptionExpiringEmail,
} from "./templates";
import logger from "logger";

interface User {
  id: string;
  email: string;
  name?: string | null;
  locale?: string;
  preferences?: any;
}

interface Subscription {
  plan: string;
  expiresAt: Date;
}

export async function sendWelcomeEmail(user: User): Promise<boolean> {
  try {
    const userLocale = user.preferences?.locale || user.locale || "en";
    const locale = (userLocale as "en" | "ar") || "en";
    const userName = user.name || user.email.split("@")[0];

    const success = await sendEmail({
      to: user.email,
      subject: getEmailSubject("welcome", locale),
      template: WelcomeEmail({
        userName,
        userEmail: user.email,
        locale,
        loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`,
      }),
      locale,
    });

    if (success) {
      logger.info(`Welcome email sent to ${user.email} (locale: ${locale})`);
    } else {
      logger.error(`Failed to send welcome email to ${user.email}`);
    }

    return success;
  } catch (error) {
    logger.error(`Error sending welcome email to ${user.email}:`, error);
    return false;
  }
}

export async function sendSubscriptionActivatedEmail(
  user: User,
  subscription: Subscription,
): Promise<boolean> {
  try {
    const userLocale = user.preferences?.locale || user.locale || "en";
    const locale = (userLocale as "en" | "ar") || "en";
    const userName = user.name || user.email.split("@")[0];

    const expiresAt = subscription.expiresAt.toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const success = await sendEmail({
      to: user.email,
      subject: getEmailSubject("subscriptionActivated", locale),
      template: SubscriptionActivatedEmail({
        userName,
        plan: subscription.plan,
        expiresAt,
        locale,
        dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      }),
      locale,
    });

    if (success) {
      logger.info(
        `Subscription activated email sent to ${user.email} for plan ${subscription.plan} (locale: ${locale})`,
      );
    } else {
      logger.error(
        `Failed to send subscription activated email to ${user.email}`,
      );
    }

    return success;
  } catch (error) {
    logger.error(
      `Error sending subscription activated email to ${user.email}:`,
      error,
    );
    return false;
  }
}

export async function sendSubscriptionExpiringEmail(
  user: User,
  subscription: Subscription,
  daysLeft: number,
): Promise<boolean> {
  try {
    const userLocale = user.preferences?.locale || user.locale || "en";
    const locale = (userLocale as "en" | "ar") || "en";
    const userName = user.name || user.email.split("@")[0];

    const expiresAt = subscription.expiresAt.toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const success = await sendEmail({
      to: user.email,
      subject: getEmailSubject("subscriptionExpiring", locale),
      template: SubscriptionExpiringEmail({
        userName,
        plan: subscription.plan,
        expiresAt,
        daysLeft,
        locale,
        renewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      }),
      locale,
    });

    if (success) {
      logger.info(
        `Subscription expiring email sent to ${user.email} (${daysLeft} days left, locale: ${locale})`,
      );
    } else {
      logger.error(
        `Failed to send subscription expiring email to ${user.email}`,
      );
    }

    return success;
  } catch (error) {
    logger.error(
      `Error sending subscription expiring email to ${user.email}:`,
      error,
    );
    return false;
  }
}

export async function checkAndSendExpirationWarnings(): Promise<void> {
  try {
    const { pgDb } = await import("lib/db/pg/db.pg");
    const { UserTable } = await import("lib/db/pg/schema.pg");
    const { getDaysRemaining } = await import("lib/subscription/expiration");
    const { eq } = await import("drizzle-orm");

    const users = await pgDb
      .select()
      .from(UserTable)
      .where(eq(UserTable.planStatus, "active"));

    const warningThresholds = [7, 3, 1];
    let emailsSent = 0;

    for (const user of users) {
      if (!user.plan || user.plan === "free" || !user.planExpiresAt) {
        continue;
      }

      const daysLeft = getDaysRemaining(user.planExpiresAt);

      if (warningThresholds.includes(daysLeft)) {
        await sendSubscriptionExpiringEmail(
          {
            id: user.id,
            email: user.email,
            name: user.name,
            preferences: user.preferences,
          },
          {
            plan: user.plan,
            expiresAt: user.planExpiresAt,
          },
          daysLeft,
        );
        emailsSent++;
      }
    }

    logger.info(
      `Completed checking and sending expiration warnings. Sent ${emailsSent} emails.`,
    );
  } catch (error) {
    logger.error("Error checking and sending expiration warnings:", error);
  }
}
