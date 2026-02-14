import { getSession } from "./auth-instance";
import { USER_ROLES } from "app-types/roles";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden: Admin access required") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  
  if (session.user.role !== USER_ROLES.ADMIN) {
    throw new ForbiddenError();
  }
  
  return session;
}
