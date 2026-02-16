import "server-only";
import { getSession } from "./auth-instance";
import { getIsUserAdmin } from "lib/user/utils";
import { admin, editor, user as userRole } from "./roles";
import type { BetterAuthRole } from "./types";
import { parseRoleString, isBetterAuthRole } from "./types";
import {
  getUserSubscription,
  requireActiveSubscription,
  type SubscriptionPlan,
} from "./subscription";

export async function hasAdminPermission(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const isAdmin = getIsUserAdmin(session.user);
    return isAdmin;
  } catch (error) {
    console.error("Error checking admin permission:", error);
    return false;
  }
}

export async function canListUsers(): Promise<boolean> {
  return await hasAdminPermission();
}

export async function canManageUsers(): Promise<boolean> {
  return await hasAdminPermission();
}

export async function canManageUser(targetUserId: string): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    if (session.user.id === targetUserId) return true;

    return await canManageUsers();
  } catch (error) {
    console.error("Error checking user management permission:", error);
    return false;
  }
}

export async function requireAdminPermission(
  action: string = "perform this action",
): Promise<void> {
  const hasPermission = await hasAdminPermission();
  if (!hasPermission) {
    throw new Error(`Unauthorized: Admin access required to ${action}`);
  }
}

export async function requireUserListPermission(
  action: string = "list users",
): Promise<void> {
  const hasPermission = await canListUsers();
  if (!hasPermission) {
    throw new Error(`Unauthorized: Permission required to ${action}`);
  }
}

export async function requireUserManagePermission(
  action: string = "manage users",
): Promise<void> {
  const hasPermission = await canManageUsers();
  if (!hasPermission) {
    throw new Error(`Unauthorized: Permission required to ${action}`);
  }
}

export async function requireUserManagePermissionFor(
  targetUserId: string,
  action: string = "manage this user",
): Promise<void> {
  const hasPermission = await canManageUser(targetUserId);
  if (!hasPermission) {
    throw new Error(`Unauthorized: Permission required to ${action}`);
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch {
    return null;
  }
}

export async function hasEditorPermission(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    return session.user.role === "admin" || session.user.role === "editor";
  } catch (error) {
    console.error("Error checking editor permission:", error);
    return false;
  }
}

function getRolePermissions(role: string | undefined | null): BetterAuthRole {
  const cleanRole = parseRoleString(role);

  switch (cleanRole) {
    case "admin":
      return admin as BetterAuthRole;
    case "editor":
      return editor as BetterAuthRole;
    case "user":
    default:
      return userRole as BetterAuthRole;
  }
}

function hasPermission(
  userRoleString: string | undefined | null,
  permission:
    | "use"
    | "create"
    | "list"
    | "delete"
    | "update"
    | "view"
    | "share",
  resource: "agent" | "workflow" | "mcp",
): boolean {
  const roleObject = getRolePermissions(userRoleString);

  if (!isBetterAuthRole(roleObject)) {
    console.error("Invalid role object structure");
    return false;
  }

  const statements = roleObject.statements;
  const resourcePermissions = statements[resource] || [];
  return (
    Array.isArray(resourcePermissions) &&
    resourcePermissions.includes(permission)
  );
}

export async function canCreateAgent(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const subscription = await getUserSubscription();
    if (!subscription?.isActive) return false;

    return hasPermission(session.user.role, "create", "agent");
  } catch (error) {
    console.error("Error checking agent create permission:", error);
    return false;
  }
}

export async function canEditAgent(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const subscription = await getUserSubscription();
    if (!subscription?.isActive) return false;

    return hasPermission(session.user.role, "update", "agent");
  } catch (error) {
    console.error("Error checking agent edit permission:", error);
    return false;
  }
}

export async function canDeleteAgent(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    return hasPermission(session.user.role, "delete", "agent");
  } catch (error) {
    console.error("Error checking agent delete permission:", error);
    return false;
  }
}

export async function canCreateWorkflow(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const subscription = await getUserSubscription();
    if (!subscription?.isActive) return false;

    return hasPermission(session.user.role, "create", "workflow");
  } catch (error) {
    console.error("Error checking workflow create permission:", error);
    return false;
  }
}

export async function canEditWorkflow(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const subscription = await getUserSubscription();
    if (!subscription?.isActive) return false;

    return hasPermission(session.user.role, "update", "workflow");
  } catch (error) {
    console.error("Error checking workflow edit permission:", error);
    return false;
  }
}

export async function canDeleteWorkflow(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    return hasPermission(session.user.role, "delete", "workflow");
  } catch (error) {
    console.error("Error checking workflow delete permission:", error);
    return false;
  }
}

export async function canCreateMCP(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const subscription = await getUserSubscription();
    if (!subscription?.isActive) return false;

    return hasPermission(session.user.role, "create", "mcp");
  } catch (error) {
    console.error("Error checking MCP create permission:", error);
    return false;
  }
}

export async function canEditMCP(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const subscription = await getUserSubscription();
    if (!subscription?.isActive) return false;

    return hasPermission(session.user.role, "update", "mcp");
  } catch (error) {
    console.error("Error checking MCP edit permission:", error);
    return false;
  }
}

export async function canChangeVisibilityMCP(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    return hasPermission(session.user.role, "share", "mcp");
  } catch (error) {
    console.error("Error checking MCP visibility change permission:", error);
    return false;
  }
}

export async function canDeleteMCP(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    return hasPermission(session.user.role, "delete", "mcp");
  } catch (error) {
    console.error("Error checking MCP delete permission:", error);
    return false;
  }
}

export async function requireEditorPermission(
  action: string = "perform this action",
): Promise<void> {
  const hasPermission = await hasEditorPermission();
  if (!hasPermission) {
    throw new Error(
      `Unauthorized: Editor or Admin access required to ${action}`,
    );
  }
}

export async function canManageMCPServer(
  mcpOwnerId: string,
  visibility: string = "private",
): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    if (session.user.role === "admin") return true;

    if (session.user.id === mcpOwnerId && visibility === "private") return true;

    return false;
  } catch (error) {
    console.error("Error checking MCP management permission:", error);
    return false;
  }
}

export async function canShareMCPServer(): Promise<boolean> {
  return await hasAdminPermission();
}

export async function requireSubscription(
  minPlan: SubscriptionPlan = "free",
): Promise<void> {
  await requireActiveSubscription(minPlan);
}
