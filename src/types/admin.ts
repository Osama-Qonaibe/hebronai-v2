import type { User } from "./user";
import type { SubscriptionPlan } from "@/lib/subscription/plans";

export interface AdminUsersQuery {
  searchValue?: string;
  searchField?: "name" | "email";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: string | number | boolean;
  filterOperator?: "lt" | "eq" | "ne" | "lte" | "gt" | "gte" | "contains";
}

export type AdminUserListItem = Omit<
  User,
  | "password"
  | "preferences"
  | "image"
  | "role"
  | "banned"
  | "banReason"
  | "banExpires"
> & {
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
};

export interface AdminUsersPaginated {
  users: AdminUserListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminUpdateUserDetailsData {
  userId: string;
  name?: string;
  email?: string;
  image?: string;
}

export type RequestStatus = "pending" | "approved" | "rejected" | "processing";

export interface AdminSubscriptionRequest {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  requestedPlan: SubscriptionPlan;
  paymentMethod: string;
  amount: string | null;
  currency: string | null;
  status: RequestStatus;
  proofImageUrl: string | null;
  transactionId: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  approvedBy: string | null;
  approvedAt: Date | null;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  pendingRequests: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  subscriptionsByPlan: Record<SubscriptionPlan, number>;
}

export type AdminRepository = {
  getUsers: (query?: AdminUsersQuery) => Promise<AdminUsersPaginated>;
  getSubscriptionRequests: (
    status?: RequestStatus,
  ) => Promise<AdminSubscriptionRequest[]>;
  approveSubscriptionRequest: (
    requestId: string,
    adminId: string,
    adminNotes?: string,
  ) => Promise<void>;
  rejectSubscriptionRequest: (
    requestId: string,
    adminId: string,
    adminNotes?: string,
  ) => Promise<void>;
  getAdminStats: () => Promise<AdminStats>;
};
