"use client";

import { useEffect, useState } from "react";
import { SubscriptionPlan } from "@/types/subscription";

export function usePlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
        const response = await fetch("/api/plans");
        
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }

        const data = await response.json();
        setPlans(data.plans || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(err instanceof Error ? err.message : "Failed to load plans");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  return { plans, loading, error };
}
