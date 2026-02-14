import { getSession } from "auth/server";
import { notFound } from "next/navigation";
import { SubscriptionCard } from "@/components/subscription/subscription-card";
import { getUserSubscription } from "lib/auth/subscription";

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        <SubscriptionCard
          currentPlan={subscription.plan}
          currentStatus={subscription.status}
          expiresAt={subscription.expiresAt}
          isActive={subscription.isActive}
        />
      </div>
    </div>
  );
}
