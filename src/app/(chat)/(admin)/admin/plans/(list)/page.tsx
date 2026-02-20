import { getSession } from "auth/server";
import { redirect } from "next/navigation";
import { PlansTable } from "@/components/admin/plans/plans-table";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const t = await getTranslations("AdminPlans");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
      </div>

      <PlansTable />
    </div>
  );
}
