import { getPlans } from "@/app/actions/subscription.actions";
import { PricingCard } from "@/components/pricing/pricing-card";
import { BillingToggle } from "@/components/pricing/billing-toggle";
import { PlanComparison } from "@/components/pricing/plan-comparison";
import { Check } from "lucide-react";

export default async function PricingPage() {
  const { data: plans } = await getPlans();

  if (!plans) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Failed to load plans</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Select the perfect plan for your needs
          </p>
          <BillingToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
          <PlanComparison plans={plans} />
        </div>

        <div className="bg-card rounded-lg p-8 border">
          <h2 className="text-2xl font-bold mb-6 text-center">All Plans Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "AI-powered chat interface",
              "Custom agent creation",
              "Workflow automation",
              "MCP server integration",
              "Secure data storage",
              "Regular updates",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}