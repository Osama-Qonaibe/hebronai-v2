import { BasicUser } from "@/types/user";
import type { Session } from "next-auth";

/**
 * Safely converts session user to BasicUser type
 * Preserves all fields including subscription data (planId)
 * 
 * @param sessionUser - User object from session
 * @returns BasicUser with all required fields
 */
export function toBasicUser(sessionUser: Session["user"]): BasicUser {
  if (!sessionUser?.id || !sessionUser?.email) {
    throw new Error("Invalid session: missing required user fields (id or email)");
  }

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name: sessionUser.name ?? null,
    image: sessionUser.image ?? null,
    role: sessionUser.role ?? null,
    banned: sessionUser.banned ?? null,
    banReason: sessionUser.banReason ?? null,
    banExpires: sessionUser.banExpires ?? null,
    planId: sessionUser.planId ?? null, // ✅ Subscription field preserved
    emailVerified: sessionUser.emailVerified ?? null,
    createdAt: sessionUser.createdAt ?? new Date(),
    updatedAt: sessionUser.updatedAt ?? new Date(),
  };
}
