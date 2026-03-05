import { ChatMessage, ChatRepository, ChatThread } from "app-types/chat";

import { pgDb as db } from "../db.pg";
import {
  ChatMessageTable,
  ChatThreadTable,
  UserTable,
  ArchiveItemTable,
} from "../schema.pg";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { checkDailyMessageLimit } from "lib/auth/usage-limits";
import { createDailyMessageLimitError, createNoSubscriptionError } from "lib/usage/limit-errors";

export const pgChatRepository: ChatRepository = {
  insertThread: async (
    thread: Omit<ChatThread, "createdAt">,
  ): Promise<ChatThread> => {
    const [result] = await db
      .insert(ChatThreadTable)
      .values({
        title: thread.title,
        userId: thread.userId,
        id: thread.id,
      })
      .returning();
    return result;
  },

  deleteChatMessage: async (id: string): Promise<void> => {
    await db.delete(ChatMessageTable).where(eq(ChatMessageTable.id, id));
  },

  selectThread: async (id: string): Promise<ChatThread | null> => {
    const [result] = await db
      .select()
      .from(ChatThreadTable)
      .where(eq(ChatThreadTable.id, id));
    return result;
  },

  selectThreadDetails: async (id: string) => {
    if (!id) {
      return null;
    }
    const [thread] = await db
      .select()
      .from(ChatThreadTable)
      .leftJoin(UserTable, eq(ChatThreadTable.userId, UserTable.id))
      .where(eq(ChatThreadTable.id, id));

    if (!thread) {
      return null;
    }

    const messages = await pgChatRepository.selectMessagesByThreadId(id);
    return {
      id: thread.chat_thread.id,
      title: thread.chat_thread.title,
      userId: thread.chat_thread.userId,
      createdAt: thread.chat_thread.createdAt,
      userPreferences: thread.user?.preferences ?? undefined,
      messages,
    };
  },

  selectMessagesByThreadId: async (
    threadId: string,
  ): Promise<ChatMessage[]> => {
    const result = await db
      .select()
      .from(ChatMessageTable)
      .where(eq(ChatMessageTable.threadId, threadId))
      .orderBy(ChatMessageTable.createdAt);
    return result as ChatMessage[];
  },

  selectThreadsByUserId: async (
    userId: string,
  ): Promise<
    (ChatThread & {
      lastMessageAt: number;
    })[]
  > => {
    const threadWithLatestMessage = await db
      .select({
        threadId: ChatThreadTable.id,
        title: ChatThreadTable.title,
        createdAt: ChatThreadTable.createdAt,
        userId: ChatThreadTable.userId,
        lastMessageAt: sql<string>`MAX(${ChatMessageTable.createdAt})`.as(
          "last_message_at",
        ),
      })
      .from(ChatThreadTable)
      .leftJoin(
        ChatMessageTable,
        eq(ChatThreadTable.id, ChatMessageTable.threadId),
      )
      .where(eq(ChatThreadTable.userId, userId))
      .groupBy(ChatThreadTable.id)
      .orderBy(desc(sql`last_message_at`));

    return threadWithLatestMessage.map((row) => {
      return {
        id: row.threadId,
        title: row.title,
        userId: row.userId,
        createdAt: row.createdAt,
        lastMessageAt: row.lastMessageAt
          ? new Date(row.lastMessageAt).getTime()
          : 0,
      };
    });
  },

  updateThread: async (
    id: string,
    thread: Partial<Omit<ChatThread, "id" | "createdAt">>,
  ): Promise<ChatThread> => {
    const [result] = await db
      .update(ChatThreadTable)
      .set({
        title: thread.title,
      })
      .where(eq(ChatThreadTable.id, id))
      .returning();
    return result;
  },
  upsertThread: async (
    thread: Omit<ChatThread, "createdAt">,
  ): Promise<ChatThread> => {
    const [result] = await db
      .insert(ChatThreadTable)
      .values(thread)
      .onConflictDoUpdate({
        target: [ChatThreadTable.id],
        set: {
          title: thread.title,
        },
      })
      .returning();
    return result;
  },

  deleteThread: async (id: string): Promise<void> => {
    await db.delete(ChatMessageTable).where(eq(ChatMessageTable.threadId, id));
    await db.delete(ArchiveItemTable).where(eq(ArchiveItemTable.itemId, id));
    await db.delete(ChatThreadTable).where(eq(ChatThreadTable.id, id));
  },

  insertMessage: async (
    message: Omit<ChatMessage, "createdAt">,
  ): Promise<ChatMessage> => {
    const thread = await db
      .select({ userId: ChatThreadTable.userId })
      .from(ChatThreadTable)
      .where(eq(ChatThreadTable.id, message.threadId))
      .limit(1);

    if (thread[0] && message.role === "user") {
      const limitCheck = await checkDailyMessageLimit(thread[0].userId);
      if (!limitCheck.allowed) {
        if (limitCheck.reason?.includes("No active subscription")) {
          throw createNoSubscriptionError();
        }
        throw createDailyMessageLimitError(
          limitCheck.current || 0,
          limitCheck.max || 0
        );
      }
    }

    const entity = {
      ...message,
      id: message.id,
    };
    const [result] = await db
      .insert(ChatMessageTable)
      .values(entity)
      .returning();
    return result as ChatMessage;
  },

  upsertMessage: async (
    message: Omit<ChatMessage, "createdAt">,
  ): Promise<ChatMessage> => {
    const result = await db
      .insert(ChatMessageTable)
      .values(message)
      .onConflictDoUpdate({
        target: [ChatMessageTable.id],
        set: {
          parts: message.parts,
          metadata: message.metadata,
        },
      })
      .returning();
    return result[0] as ChatMessage;
  },

  deleteMessagesByChatIdAfterTimestamp: async (
    messageId: string,
  ): Promise<void> => {
    const [message] = await db
      .select()
      .from(ChatMessageTable)
      .where(eq(ChatMessageTable.id, messageId));
    if (!message) {
      return;
    }
    await db
      .delete(ChatMessageTable)
      .where(
        and(
          eq(ChatMessageTable.threadId, message.threadId),
          gte(ChatMessageTable.createdAt, message.createdAt),
        ),
      );
  },

  deleteAllThreads: async (userId: string): Promise<void> => {
    const threadIds = await db
      .select({ id: ChatThreadTable.id })
      .from(ChatThreadTable)
      .where(eq(ChatThreadTable.userId, userId));
    await Promise.all(
      threadIds.map((threadId) => pgChatRepository.deleteThread(threadId.id)),
    );
  },

  deleteUnarchivedThreads: async (userId: string): Promise<void> => {
    const unarchivedThreadIds = await db
      .select({ id: ChatThreadTable.id })
      .from(ChatThreadTable)
      .leftJoin(
        ArchiveItemTable,
        eq(ChatThreadTable.id, ArchiveItemTable.itemId),
      )
      .where(
        and(
          eq(ChatThreadTable.userId, userId),
          sql`${ArchiveItemTable.id} IS NULL`,
        ),
      );

    await Promise.all(
      unarchivedThreadIds.map((threadId) =>
        pgChatRepository.deleteThread(threadId.id),
      ),
    );
  },

  insertMessages: async (
    messages: PartialBy<ChatMessage, "createdAt">[],
  ): Promise<ChatMessage[]> => {
    if (messages.length > 0 && messages[0].threadId) {
      const thread = await db
        .select({ userId: ChatThreadTable.userId })
        .from(ChatThreadTable)
        .where(eq(ChatThreadTable.id, messages[0].threadId))
        .limit(1);

      if (thread[0]) {
        const userMessages = messages.filter((m) => m.role === "user");
        if (userMessages.length > 0) {
          const limitCheck = await checkDailyMessageLimit(thread[0].userId);
          if (!limitCheck.allowed) {
            if (limitCheck.reason?.includes("No active subscription")) {
              throw createNoSubscriptionError();
            }
            throw createDailyMessageLimitError(
              limitCheck.current || 0,
              limitCheck.max || 0
            );
          }
        }
      }
    }

    const result = await db
      .insert(ChatMessageTable)
      .values(messages)
      .returning();
    return result as ChatMessage[];
  },

  checkAccess: async (id: string, userId: string): Promise<boolean> => {
    const [result] = await db
      .select({
        userId: ChatThreadTable.userId,
      })
      .from(ChatThreadTable)
      .where(
        and(eq(ChatThreadTable.id, id), eq(ChatThreadTable.userId, userId)),
      );
    return Boolean(result);
  },
};
