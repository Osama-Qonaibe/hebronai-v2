import { getSession } from "auth/server";
import { notFound } from "next/navigation";
import { SubscriptionCard } from "@/components/subscription/subscription-card";
import { getUserSubscription } from "lib/auth/subscription";
import { getTranslations } from "next-intl/server";
import { subscriptionRequestRepository } from "@/lib/db/pg/repositories/subscription-request-repository.pg";
import { Alert, AlertDescription } from "ui/alert";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const session = await getSession();

  if (!session?.user.id) {
    notFound();
  }

  const subscription = await getUserSubscription();

  if (!subscription) {
    notFound();
  }

  // Get pending subscription request
  const pendingRequest = await subscriptionRequestRepository.getPendingRequest(
    session.user.id,
  );

  const t = await getTranslations("Subscription");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>

        {pendingRequest && (
          <Alert className="mb-6">
            <AlertDescription>
              {t("pendingRequestMessage", {
                plan: pendingRequest.requestedPlan,
              })}
            </AlertDescription>
          </Alert>
        )}

        <SubscriptionCard
          currentPlan={subscription.plan}
          currentStatus={subscription.status}
          expiresAt={subscription.expiresAt}
          isActive={subscription.isActive}
          pendingRequest={pendingRequest}
        />
      </div>
    </div>
  );
}
