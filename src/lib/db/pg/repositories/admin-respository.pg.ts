import {
  AdminRepository,
  AdminUsersQuery,
  AdminUsersPaginated,
  AdminSubscriptionRequest,
  AdminStats,
} from "app-types/admin";
import { pgDb as db } from "../db.pg";
import {
  UserTable,
  SessionTable,
  SubscriptionRequestTable,
} from "../schema.pg";
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import type { SubscriptionPlan } from "@/lib/subscription/plans";
import type { RequestStatus } from "./subscription-request-repository.pg";
import { calculateExpirationDate } from "@/lib/subscription/expiration";

const getUserColumnsWithoutPassword = () => {
  const { password, ...userColumns } = getTableColumns(UserTable);
  return userColumns;
};

const pgAdminRepository: AdminRepository = {
  getUsers: async (query?: AdminUsersQuery): Promise<AdminUsersPaginated> => {
    const {
      searchValue,
      limit = 10,
      offset = 0,
      sortBy = "createdAt",
      sortDirection = "desc",
      filterField,
      filterValue,
      filterOperator = "eq",
    } = query || {};

    const baseQuery = db
      .select({
        ...getUserColumnsWithoutPassword(),
        lastLogin: sql<Date | null>`(
          SELECT MAX(${SessionTable.updatedAt}) 
          FROM ${SessionTable} 
          WHERE ${SessionTable.userId} = ${UserTable.id}
        )`.as("lastLogin"),
      })
      .from(UserTable);

    const whereConditions: any[] = [];

    if (searchValue && searchValue.trim()) {
      const searchTerm = `%${searchValue.trim()}%`;
      whereConditions.push(
        or(
          ilike(UserTable.name, searchTerm),
          ilike(UserTable.email, searchTerm),
        ),
      );
    }

    if (filterField && filterValue !== undefined) {
      const filterCondition = buildFilterCondition(
        filterField,
        filterValue,
        filterOperator,
      );
      if (filterCondition) {
        whereConditions.push(filterCondition);
      }
    }

    const whereClause =
      whereConditions.length > 0
        ? whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
        : undefined;

    const orderByClause = buildOrderBy(sortBy, sortDirection);

    const usersQueryBuilder = baseQuery
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
    const users = whereClause
      ? await usersQueryBuilder.where(whereClause)
      : await usersQueryBuilder;

    const countQueryBuilder = db.select({ count: count() }).from(UserTable);
    const [totalResult] = whereClause
      ? await countQueryBuilder.where(whereClause)
      : await countQueryBuilder;

    return {
      users: users.map((user) => ({
        ...user,
        preferences: undefined,
      })),
      total: totalResult?.count || 0,
      limit,
      offset,
    };
  },

  getSubscriptionRequests: async (
    status?: RequestStatus,
  ): Promise<AdminSubscriptionRequest[]> => {
    const baseQuery = db
      .select({
        id: SubscriptionRequestTable.id,
        userId: SubscriptionRequestTable.userId,
        userName: UserTable.name,
        userEmail: UserTable.email,
        userImage: UserTable.image,
        requestedPlan: SubscriptionRequestTable.requestedPlan,
        paymentMethod: SubscriptionRequestTable.paymentMethod,
        amount: SubscriptionRequestTable.amount,
        currency: SubscriptionRequestTable.currency,
        status: SubscriptionRequestTable.status,
        proofImageUrl: SubscriptionRequestTable.proofImageUrl,
        transactionId: SubscriptionRequestTable.transactionId,
        notes: SubscriptionRequestTable.notes,
        adminNotes: SubscriptionRequestTable.adminNotes,
        createdAt: SubscriptionRequestTable.createdAt,
        approvedBy: SubscriptionRequestTable.approvedBy,
        approvedAt: SubscriptionRequestTable.approvedAt,
      })
      .from(SubscriptionRequestTable)
      .leftJoin(UserTable, eq(SubscriptionRequestTable.userId, UserTable.id))
      .orderBy(desc(SubscriptionRequestTable.createdAt));

    if (status) {
      return await baseQuery.where(eq(SubscriptionRequestTable.status, status));
    }

    return await baseQuery;
  },

  approveSubscriptionRequest: async (
    requestId: string,
    adminId: string,
    adminNotes?: string,
  ): Promise<void> => {
    await db.transaction(async (tx) => {
      const [request] = await tx
        .select()
        .from(SubscriptionRequestTable)
        .where(eq(SubscriptionRequestTable.id, requestId));

      if (!request) {
        throw new Error("Subscription request not found");
      }

      await tx
        .update(SubscriptionRequestTable)
        .set({
          status: "approved",
          approvedBy: adminId,
          approvedAt: new Date(),
          adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(SubscriptionRequestTable.id, requestId));

      // Calculate expiration date based on plan
      const expirationDate = calculateExpirationDate(
        request.requestedPlan as SubscriptionPlan,
      );

      await tx
        .update(UserTable)
        .set({
          plan: request.requestedPlan as
            | "free"
            | "basic"
            | "pro"
            | "enterprise",
          planStatus: "active",
          planExpiresAt: expirationDate,
          updatedAt: new Date(),
        })
        .where(eq(UserTable.id, request.userId));

      // Get user details to send email
      const [user] = await tx
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, request.userId));

      // Send subscription activated email
      if (user) {
        const { sendSubscriptionActivatedEmail } = await import(
          "@/lib/email/notifications"
        );

        void sendSubscriptionActivatedEmail(
          {
            id: user.id,
            email: user.email,
            name: user.name,
            locale: (user as any).locale,
          },
          {
            plan: request.requestedPlan,
            expiresAt: expirationDate,
          },
        );
      }
    });
  },

  rejectSubscriptionRequest: async (
    requestId: string,
    adminId: string,
    adminNotes?: string,
  ): Promise<void> => {
    await db
      .update(SubscriptionRequestTable)
      .set({
        status: "rejected",
        approvedBy: adminId,
        approvedAt: new Date(),
        adminNotes,
        updatedAt: new Date(),
      })
      .where(eq(SubscriptionRequestTable.id, requestId));
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(UserTable);

    const [activeSubscriptionsResult] = await db
      .select({ count: count() })
      .from(UserTable)
      .where(eq(UserTable.planStatus, "active"));

    const [pendingRequestsResult] = await db
      .select({ count: count() })
      .from(SubscriptionRequestTable)
      .where(eq(SubscriptionRequestTable.status, "pending"));

    const revenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${SubscriptionRequestTable.amount} AS DECIMAL)), 0)`,
      })
      .from(SubscriptionRequestTable)
      .where(eq(SubscriptionRequestTable.status, "approved"));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [newUsersResult] = await db
      .select({ count: count() })
      .from(UserTable)
      .where(sql`${UserTable.createdAt} >= ${thirtyDaysAgo}`);

    const planCounts = await db
      .select({
        plan: UserTable.plan,
        count: count(),
      })
      .from(UserTable)
      .where(eq(UserTable.planStatus, "active"))
      .groupBy(UserTable.plan);

    const subscriptionsByPlan: Record<SubscriptionPlan, number> = {
      free: 0,
      basic: 0,
      pro: 0,
      enterprise: 0,
    };

    planCounts.forEach((item) => {
      if (item.plan === "basic") {
        subscriptionsByPlan.basic = item.count;
      } else if (item.plan === "pro") {
        subscriptionsByPlan.pro = item.count;
      } else if (item.plan === "enterprise") {
        subscriptionsByPlan.enterprise = item.count;
      } else if (item.plan === "free") {
        subscriptionsByPlan.free = item.count;
      }
    });

    return {
      totalUsers: totalUsersResult?.count || 0,
      activeSubscriptions: activeSubscriptionsResult?.count || 0,
      pendingRequests: pendingRequestsResult?.count || 0,
      totalRevenue: Number(revenueResult[0]?.total || 0),
      newUsersThisMonth: newUsersResult?.count || 0,
      subscriptionsByPlan,
    };
  },
};

function buildFilterCondition(
  field: string,
  value: string | number | boolean,
  operator: string,
) {
  let column;
  switch (field) {
    case "name":
      column = UserTable.name;
      break;
    case "email":
      column = UserTable.email;
      break;
    case "role":
      column = UserTable.role;
      break;
    case "banned":
      column = UserTable.banned;
      break;
    case "createdAt":
      column = UserTable.createdAt;
      break;
    case "updatedAt":
      column = UserTable.updatedAt;
      break;
    default:
      return null;
  }

  switch (operator) {
    case "eq":
      return eq(column, value);
    case "ne":
      return sql`${column} != ${value}`;
    case "lt":
      return sql`${column} < ${value}`;
    case "lte":
      return sql`${column} <= ${value}`;
    case "gt":
      return sql`${column} > ${value}`;
    case "gte":
      return sql`${column} >= ${value}`;
    case "contains":
      return ilike(column, `%${value}%`);
    default:
      return eq(column, value);
  }
}

function buildOrderBy(sortBy: string, direction: "asc" | "desc") {
  let column;
  switch (sortBy) {
    case "name":
      column = UserTable.name;
      break;
    case "email":
      column = UserTable.email;
      break;
    case "role":
      column = UserTable.role;
      break;
    case "createdAt":
      column = UserTable.createdAt;
      break;
    case "updatedAt":
      column = UserTable.updatedAt;
      break;
    default:
      column = UserTable.createdAt;
      break;
  }
  return direction === "asc" ? asc(column) : desc(column);
}

export default pgAdminRepository;
