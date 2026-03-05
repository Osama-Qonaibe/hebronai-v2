#!/usr/bin/env tsx
/**
 * Script to seed test users using Better Auth's APIs
 * Creates 21 users with proper password hashing via Better Auth
 *
 * Usage:
 *   pnpm test:e2e:seed
 */

import { config } from "dotenv";

import { TEST_USERS } from "../tests/constants/test-users";

if (process.env.CI) {
  config({ path: ".env.test" });
} else {
  config();
}

import { auth } from "lib/auth/auth-script";
import { USER_ROLES } from "app-types/roles";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  UserTable,
  ChatMessageTable,
  ChatThreadTable,
} from "lib/db/pg/schema.pg";
import { like, eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!,
});
const db = drizzle(pool);

async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email));
  return user || null;
}

async function clearExistingTestUsers() {
  console.log("🧹 Clearing existing test users...");

  try {
    const testEmailPatterns = [
      "%@test-seed.local%",
      "%playwright%",
      "%@example.com%",
      "%testuser%@testuser.com%",
      "%testuser%@gmail.com%",
    ];

    const testUsers: { id: string }[] = [];
    for (const pattern of testEmailPatterns) {
      const users = await db
        .select({ id: UserTable.id })
        .from(UserTable)
        .where(like(UserTable.email, pattern));
      testUsers.push(...users);
    }

    const legacyTestEmails = [
      "admin@testuser.com",
      "editor@testuser.com",
      "user@testuser.com",
    ];

    for (let i = 4; i <= 21; i++) {
      legacyTestEmails.push(`testuser${i}@testuser.com`);
      legacyTestEmails.push(`testuser${i}@gmail.com`);
    }

    for (const email of legacyTestEmails) {
      const users = await db
        .select({ id: UserTable.id })
        .from(UserTable)
        .where(sql`email = ${email}`);
      testUsers.push(...users);
    }

    if (testUsers.length > 0) {
      const userIds = testUsers.map((u) => u.id);
      console.log(`Found ${userIds.length} test users to clean up`);

      console.log("Deleting chat messages...");
      if (userIds.length > 0) {
        const threads = await db
          .select({ id: ChatThreadTable.id })
          .from(ChatThreadTable)
          .where(sql`${ChatThreadTable.userId} = ANY(${userIds})`);
        const threadIds = threads.map((t) => t.id);
        if (threadIds.length > 0) {
          await db
            .delete(ChatMessageTable)
            .where(sql`${ChatMessageTable.threadId} = ANY(${threadIds})`);
        }
      }

      console.log("Deleting chat threads...");
      for (const userId of userIds) {
        await db
          .delete(ChatThreadTable)
          .where(sql`${ChatThreadTable.userId} = ${userId}`);
      }

      console.log("Deleting users...");
      for (const pattern of testEmailPatterns) {
        await db.delete(UserTable).where(like(UserTable.email, pattern));
      }
      for (const email of legacyTestEmails) {
        await db.delete(UserTable).where(sql`email = ${email}`);
      }
    }
  } catch (error) {
    console.log(
      "Note: Error during cleanup (may be expected if tables are empty):",
      error,
    );
  }
}

async function createUserWithBetterAuth(userData: {
  email: string;
  password: string;
  name: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
}) {
  try {
    const existingUser = await getUserByEmail(userData.email);

    let user;
    if (existingUser) {
      console.log(
        `  User ${userData.email} already exists, using existing user (ID: ${existingUser.id})`,
      );
      user = existingUser;
    } else {
      const result = await auth.api.signUpEmail({
        body: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
        },
        headers: new Headers({
          "content-type": "application/json",
        }),
      });

      if (!result.user) {
        throw new Error("User creation failed");
      }

      user = result.user;
      console.log(`  Created new user ${userData.email} (ID: ${user.id})`);
    }

    const [currentUser] = await db
      .select()
      .from(UserTable)
      .where(sql`id = ${user.id}`);

    if (userData.role && currentUser) {
      if (currentUser.role !== userData.role) {
        try {
          console.log(
            `  Updating role from ${currentUser.role} to ${userData.role} for ${userData.email}`,
          );
          await db
            .update(UserTable)
            .set({ role: userData.role })
            .where(sql`id = ${user.id}`);
        } catch (error) {
          console.warn(`Could not set role for ${userData.email}:`, error);
        }
      } else {
        console.log(
          `  Role already correct (${currentUser.role}) for ${userData.email}`,
        );
      }
    }

    if (userData.banned && userData.banReason) {
      try {
        await db
          .update(UserTable)
          .set({
            banned: true,
            banReason: userData.banReason,
            banExpires: null,
          })
          .where(sql`id = ${user.id}`);
      } catch (error) {
        console.warn(`Could not ban user ${userData.email}:`, error);
      }
    }

    return user;
  } catch (error) {
    console.error(`Failed to create user ${userData.email}:`, error);

    try {
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser) {
        console.log(
          `  Found existing user ${userData.email} after error, using existing user (ID: ${existingUser.id})`,
        );
        return existingUser;
      }
    } catch (fallbackError) {
      console.warn(
        `Could not retrieve existing user ${userData.email}:`,
        fallbackError,
      );
    }

    return null;
  }
}

async function seedTestUsers() {
  console.log("🌱 Starting test user seeding using Better Auth APIs...");

  try {
    await clearExistingTestUsers();
    console.log("✅ Existing test users cleared");

    console.log("👤 Creating main test users...");

    const adminUser = await createUserWithBetterAuth({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
      name: TEST_USERS.admin.name,
      role: USER_ROLES.ADMIN,
    });
    console.log("✅ Created admin user:", adminUser?.id);

    const editorUser = await createUserWithBetterAuth({
      email: TEST_USERS.editor.email,
      password: TEST_USERS.editor.password,
      name: TEST_USERS.editor.name,
      role: USER_ROLES.EDITOR,
    });
    console.log("✅ Created editor user:", editorUser?.id);

    const editor2User = await createUserWithBetterAuth({
      email: TEST_USERS.editor2.email,
      password: TEST_USERS.editor2.password,
      name: TEST_USERS.editor2.name,
      role: USER_ROLES.EDITOR,
    });
    console.log("✅ Created editor2 user:", editor2User?.id);

    const regularUser = await createUserWithBetterAuth({
      email: TEST_USERS.regular.email,
      password: TEST_USERS.regular.password,
      name: TEST_USERS.regular.name,
      role: USER_ROLES.USER,
    });
    console.log("✅ Created regular user:", regularUser?.id);

    console.log("👥 Creating additional test users...");
    let createdCount = 4;

    for (let i = 4; i <= 21; i++) {
      try {
        const isEditor = i <= 9;
        const isBanned = i === 21;
        const email = `testuser${i}@test-seed.local`;

        await createUserWithBetterAuth({
          email,
          password: `TestPass${i}!`,
          name: `Test User ${i}`,
          role: isEditor ? USER_ROLES.EDITOR : USER_ROLES.USER,
          banned: isBanned,
          banReason: isBanned ? "Test ban for E2E testing" : undefined,
        });
        createdCount++;
        console.log(`✅ Created user ${i}`);
      } catch (_error) {
        console.warn(`⚠️ Failed to create user ${i}, continuing...`);
      }
    }

    console.log("📊 Creating sample AI usage data for stats testing...");
    const userIdsForSampleData = [
      adminUser?.id,
      editorUser?.id,
      editor2User?.id,
      regularUser?.id,
    ].filter(Boolean) as string[];
    if (userIdsForSampleData.length > 0) {
      await seedSampleUsageData(userIdsForSampleData);
    } else {
      console.warn("⚠️ No valid user IDs found for sample data creation");
    }

    console.log(
      `\n✅ Test data seeded successfully! Created ${createdCount} users with sample usage data.`,
    );

    console.log("\n🔑 Test Credentials:");
    console.log(
      `  Admin: ${TEST_USERS.admin.email} / ${TEST_USERS.admin.password}`,
    );
    console.log(
      `  Editor: ${TEST_USERS.editor.email} / ${TEST_USERS.editor.password}`,
    );
    console.log(
      `  Editor2: ${TEST_USERS.editor2.email} / ${TEST_USERS.editor2.password}`,
    );
    console.log(
      `  Regular: ${TEST_USERS.regular.email} / ${TEST_USERS.regular.password}`,
    );
    console.log(`  Others: testuser{4-21}@test-seed.local / TestPass{n}!`);

    console.log("\n📁 Auth Files Will Be Created:");
    console.log(`  - tests/.auth/${TEST_USERS.admin.authFile} (admin user)`);
    console.log(`  - tests/.auth/${TEST_USERS.editor.authFile} (editor user)`);
    console.log(
      `  - tests/.auth/${TEST_USERS.editor2.authFile} (editor2 user)`,
    );
    console.log(
      `  - tests/.auth/${TEST_USERS.regular.authFile} (regular user)`,
    );
  } catch (error) {
    console.error("❌ Error seeding test users:", error);
    throw error;
  }
}

async function seedSampleUsageData(userIds: string[]) {
  try {
    for (const userId of userIds) {
      if (!userId) {
        console.warn("⚠️ Skipping sample data creation for undefined user ID");
        continue;
      }

      const thread = await db
        .insert(ChatThreadTable)
        .values({
          userId: userId,
          title: `Test AI Conversation ${userId}`,
        })
        .returning();

      if (thread[0]) {
        const timestamp = Date.now();
        await db.insert(ChatMessageTable).values([
          {
            id: `${userId}-msg-1-${timestamp}`,
            threadId: thread[0].id,
            role: "user" as const,
            parts: [{ type: "text", text: "Test user message" }],
          },
          {
            id: `${userId}-msg-2-${timestamp}`,
            threadId: thread[0].id,
            role: "assistant" as const,
            parts: [{ type: "text", text: "Test assistant response" }],
            metadata: {
              chatModel: { provider: "openai", model: "gpt-4o" },
              usage: {
                totalTokens: Math.floor(Math.random() * 100) + 100,
                inputTokens: Math.floor(Math.random() * 100) + 50,
                outputTokens: Math.floor(Math.random() * 100) + 50,
              },
            },
          },
          {
            id: `${userId}-msg-3-${timestamp}`,
            threadId: thread[0].id,
            role: "assistant" as const,
            parts: [{ type: "text", text: "Another test response" }],
            metadata: {
              chatModel: {
                provider: "anthropic",
                model: "claude-3-5-sonnet-20241022",
              },
              usage: {
                totalTokens: Math.floor(Math.random() * 100) + 100,
                inputTokens: Math.floor(Math.random() * 100) + 50,
                outputTokens: Math.floor(Math.random() * 100) + 50,
              },
            },
          },
        ]);
      }
    }

    console.log(`✅ Created sample usage data for admin user`);

    console.log(
      `✅ Editor user left without usage data for empty state testing`,
    );
  } catch (error) {
    console.warn("⚠️ Failed to seed usage data:", error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestUsers()
    .then(async () => {
      console.log("🎉 Seeding completed!");
      await pool.end();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error("💥 Seeding failed:", error);
      await pool.end();
      process.exit(1);
    });
}
