"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { PlanEntity } from "@/lib/db/pg/schema.pg";

interface PlanComparisonProps {
  plans: PlanEntity[];
}

export function PlanComparison({ plans }: PlanComparisonProps) {
  const features = [
    { key: "maxChatsPerMonth", label: "Chats per month" },
    { key: "maxAgents", label: "Agents" },
    { key: "maxWorkflows", label: "Workflows" },
    { key: "maxMcpServers", label: "MCP Servers" },
    { key: "maxFileUploadSizeMB", label: "File upload size" },
    { key: "apiAccess", label: "API Access" },
    { key: "webhooks", label: "Webhooks" },
    { key: "advancedAnalytics", label: "Advanced Analytics" },
    { key: "customBranding", label: "Custom Branding" },
    { key: "prioritySupport", label: "Priority Support" },
    { key: "customDomain", label: "Custom Domain" },
  ];

  const formatValue = (value: any, key: string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground mx-auto" />
      );
    }
    if (value === "unlimited") {
      return "Unlimited";
    }
    if (key === "maxFileUploadSizeMB") {
      return `${value}MB`;
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Feature</TableHead>
            {plans.map((plan) => (
              <TableHead key={plan.id} className="text-center">
                {plan.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.key}>
              <TableCell className="font-medium">{feature.label}</TableCell>
              {plans.map((plan) => {
                const planFeatures = plan.features as Record<string, any>;
                return (
                  <TableCell key={plan.id} className="text-center">
                    {formatValue(planFeatures[feature.key], feature.key)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}