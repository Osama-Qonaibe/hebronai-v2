import { Suspense } from "react";
import { getAllPlansAction } from "@/app/api/admin/plans/actions";
import { PlansTable } from "@/components/admin/plans/plans-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Plans Management | Admin",
  description: "Manage subscription plans",
};

async function PlansContent() {
  const result = await getAllPlansAction();

  if (!result.success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Failed to load plans: {result.message}</p>
        </CardContent>
      </Card>
    );
  }

  const plans = result.data || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              Manage subscription plans and pricing
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/plans/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Plan
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No plans found</p>
            <Button asChild variant="outline">
              <Link href="/admin/plans/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Plan
              </Link>
            </Button>
          </div>
        ) : (
          <PlansTable plans={plans} />
        )}
      </CardContent>
    </Card>
  );
}

export default function PlansPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plans Management</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage subscription plans for your application
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Loading plans...</p>
            </CardContent>
          </Card>
        }
      >
        <PlansContent />
      </Suspense>
    </div>
  );
}
