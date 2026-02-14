import { SubscriptionsTable } from "@/components/admin/subscriptions-table";
import { requireAdminPermission } from "auth/permissions";
import { getSession } from "lib/auth/server";
import { redirect, unauthorized } from "next/navigation";
import { adminRepository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    status?: "pending" | "approved" | "rejected" | "processing";
  }>;
}

export default async function SubscriptionsListPage({
  searchParams,
}: PageProps) {
  try {
    await requireAdminPermission();
  } catch (_error) {
    unauthorized();
  }

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const requests = await adminRepository.getSubscriptionRequests(
    params.status
  );

  return <SubscriptionsTable requests={requests} />;
}
