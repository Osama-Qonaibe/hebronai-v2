"use client";

import { useState } from "react";
import { usePlans } from "@/hooks/use-plans";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table";
import { Button } from "ui/button";
import { Badge } from "ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PlanDialogEnhanced } from "./plan-dialog-enhanced";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "ui/alert-dialog";
import { SubscriptionPlan } from "@/types/subscription";

export function PlansTable() {
  const t = useTranslations("Admin.Plans");
  const tCommon = useTranslations("Common");
  const { plans, loading } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!planToDelete) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/plans/${planToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(t("planDeleted"));
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || t("deleteFailed"));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("deleteFailed"));
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleToggleActive = async (planId: string, currentState: boolean) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminSettings: { isActive: !currentState },
        }),
      });

      if (response.ok) {
        toast.success(t("planUpdated"));
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || t("updateFailed"));
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(t("updateFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("createPlan")}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("planName")}</TableHead>
                <TableHead>{t("planPrice")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("visibility")}</TableHead>
                <TableHead>{t("planDuration")}</TableHead>
                <TableHead className="text-right">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t("noPlanstYet")}
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">
                          {plan.displayName.en}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {plan.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {plan.pricing.monthly === 0
                        ? t("free")
                        : `$${plan.pricing.monthly}/${t("monthly")}`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={plan.adminSettings.isActive ? "default" : "secondary"}
                      >
                        {plan.adminSettings.isActive ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {plan.adminSettings.isActive ? tCommon("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={plan.adminSettings.isVisible ? "default" : "outline"}
                      >
                        {plan.adminSettings.isVisible ? (
                          <Eye className="h-3 w-3 mr-1" />
                        ) : (
                          <EyeOff className="h-3 w-3 mr-1" />
                        )}
                        {plan.adminSettings.isVisible ? tCommon("visible") : t("hidden")}
                      </Badge>
                    </TableCell>
                    <TableCell>{plan.metadata.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleActive(
                              plan.id,
                              plan.adminSettings.isActive,
                            )
                          }
                          disabled={actionLoading}
                        >
                          {plan.adminSettings.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(plan.id)}
                          disabled={actionLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PlanDialogEnhanced
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={selectedPlan}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeletePlan")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deletePlanWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                tCommon("delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
