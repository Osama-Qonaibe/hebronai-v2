// Base auth instance without "server-only" - can be used in seed scripts
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { pgDb } from "lib/db/pg/db.pg";
import { headers } from "next/headers";
import {
  AccountTable,
  SessionTable,
  UserTable,
  VerificationTable,
} from "lib/db/pg/schema.pg";
import { getAuthConfig } from "./config";
import logger from "logger";
import { userRepository } from "lib/db/repository";
import { DEFAULT_USER_ROLE, USER_ROLES } from "app-types/roles";
import { admin, editor, user, ac } from "./roles";

const {
  emailAndPasswordEnabled,
  signUpEnabled,
  socialAuthenticationProviders,
} = getAuthConfig();

const detectLocaleFromHeaders = async (): Promise<string> => {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());
      
      for (const lang of languages) {
        if (lang.startsWith('ar')) return 'ar';
      }
    }
  } catch (error) {
    logger.error('Error detecting locale from headers:', error);
  }
  
  return 'en';
};

const options = {
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [
    adminPlugin({
      defaultRole: DEFAULT_USER_ROLE,
      adminRoles: [USER_ROLES.ADMIN],
      ac,
      roles: {
        admin,
        editor,
        user,
      },
    }),
    nextCookies(),
  ],
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL,
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  database: drizzleAdapter(pgDb, {
    provider: "pg",
    schema: {
      user: UserTable,
      session: SessionTable,
      account: AccountTable,
      verification: VerificationTable,
    },
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const isFirstUser = await getIsFirstUser();
          const role = isFirstUser ? USER_ROLES.ADMIN : DEFAULT_USER_ROLE;
          const detectedLocale = await detectLocaleFromHeaders();

          logger.info(
            `User creation hook: ${user.email} will get role: ${role} (isFirstUser: ${isFirstUser}), detected locale: ${detectedLocale}`,
          );

          return {
            data: {
              ...user,
              role,
              preferences: {
                locale: detectedLocale,
              },
            },
          };
        },
        after: async (user) => {
          const { sendWelcomeEmail } = await import("lib/email/notifications");

          const userPreferences = (user as any).preferences || {};
          const locale = userPreferences.locale || "en";

          void sendWelcomeEmail({
            id: user.id,
            email: user.email,
            name: user.name,
            preferences: userPreferences,
          });

          logger.info(`Welcome email queued for ${user.email} with locale: ${locale}`);
        },
      },
    },
  },
  emailAndPassword: {
    enabled: emailAndPasswordEnabled,
    disableSignUp: !signUpEnabled,
    sendResetPassword: async ({ user, url, token }, request) => {
      const { sendEmail, getEmailSubject } = await import(
        "lib/email/email-service"
      );
      const { PasswordResetEmail } = await import("lib/email/templates");

      const userPreferences = (user as any).preferences || {};
      const locale = userPreferences.locale || "en";

      void sendEmail({
        to: user.email,
        subject: getEmailSubject("passwordReset", locale),
        template: PasswordResetEmail({
          userName: user.name || user.email.split("@")[0],
          resetUrl: url,
          locale,
        }),
        locale,
      });

      logger.info(`Password reset email sent to ${user.email} (locale: ${locale})`);
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    useSecureCookies:
      process.env.NO_HTTPS == "1"
        ? false
        : process.env.NODE_ENV === "production",
    database: {
      generateId: false,
    },
  },
  account: {
    accountLinking: {
      trustedProviders: (
        Object.keys(
          socialAuthenticationProviders,
        ) as (keyof typeof socialAuthenticationProviders)[]
      ).filter((key) => socialAuthenticationProviders[key]),
    },
  },
  socialProviders: socialAuthenticationProviders,
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [...(options.plugins ?? [])],
});

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      logger.error("No session found");
      return null;
    }
    return session;
  } catch (error) {
    logger.error("Error getting session:", error);
    return null;
  }
};

let isFirstUserCache: boolean | null = null;

export const getIsFirstUser = async () => {
  if (isFirstUserCache === false) {
    return false;
  }

  try {
    const userCount = await userRepository.getUserCount();
    const isFirstUser = userCount === 0;

    if (!isFirstUser) {
      isFirstUserCache = false;
    }

    return isFirstUser;
  } catch (error) {
    logger.error("Error checking if first user:", error);
    isFirstUserCache = false;
    return false;
  }
};
