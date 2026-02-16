import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/card";
import { getTranslations } from "next-intl/server";

interface SubscriptionsLayoutProps {
  children: ReactNode;
}

export default async function SubscriptionsLayout({
  children,
}: SubscriptionsLayoutProps) {
  const t = await getTranslations("Admin.Subscriptions");

  return (
    <div className="relative bg-background w-full flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto p-6 w-full">
        <div className="space-y-4 w-full max-w-none">
          <Card className="w-full border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("title", { default: "Subscription Requests" })}
              </CardTitle>
              <CardDescription>
                {t("description", {
                  default: "Review and manage subscription requests",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-6 w-full">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
