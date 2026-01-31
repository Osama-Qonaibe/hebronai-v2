"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function BillingToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cycle, setCycle] = useState<"monthly" | "yearly">(
    (searchParams.get("cycle") as "monthly" | "yearly") || "monthly"
  );

  const handleToggle = (newCycle: "monthly" | "yearly") => {
    setCycle(newCycle);
    const params = new URLSearchParams(searchParams.toString());
    params.set("cycle", newCycle);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
      <button
        onClick={() => handleToggle("monthly")}
        className={cn(
          "px-6 py-2 rounded-md text-sm font-medium transition-all",
          cycle === "monthly"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Monthly
      </button>
      <button
        onClick={() => handleToggle("yearly")}
        className={cn(
          "px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
          cycle === "yearly"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Yearly
        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          Save 17%
        </span>
      </button>
    </div>
  );
}