"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui/dialog";
import { Button } from "ui/button";
import { Input } from "ui/input";
import { Label } from "ui/label";
import { Textarea } from "ui/textarea";
import { Switch } from "ui/switch";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/types/subscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

export function PlanDialog({ open, onOpenChange, plan }: PlanDialogProps) {
  const t = useTranslations("Admin.Plans");
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    displayName: { en: "", ar: "" },
    description: { en: "", ar: "" },
    pricing: { monthly: 0, yearly: 0, currency: "USD" },
    isActive: true,
    isVisible: true,
    isFeatured: false,
    order: 1,
    paymentType: "manual" as "manual" | "stripe",
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    messagesPerDay: 50,
    messagesPerMonth: 1000,
    imagesPerDay: 5,
    imagesPerMonth: 50,
    maxActiveChats: 5,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        slug: plan.slug,
        displayName: plan.displayName,
        description: plan.description,
        pricing: plan.pricing,
        isActive: plan.adminSettings.isActive,
        isVisible: plan.adminSettings.isVisible,
        isFeatured: plan.adminSettings.isFeatured,
        order: plan.metadata.order,
        paymentType: (plan as any).paymentType ?? "manual",
        stripePriceIdMonthly: (plan as any).stripePriceIdMonthly ?? "",
        stripePriceIdYearly: (plan as any).stripePriceIdYearly ?? "",
        messagesPerDay: plan.limits?.messages?.maxPerDay ?? 50,
        messagesPerMonth: plan.limits?.messages?.maxPerMonth ?? 1000,
        imagesPerDay: (plan.limits as any)?.images?.maxPerDay ?? 5,
        imagesPerMonth: (plan.limits as any)?.images?.maxPerMonth ?? 50,
        maxActiveChats: plan.limits?.chats?.maxActive ?? 5,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        displayName: { en: "", ar: "" },
        description: { en: "", ar: "" },
        pricing: { monthly: 0, yearly: 0, currency: "USD" },
        isActive: true,
        isVisible: true,
        isFeatured: false,
        order: 1,
        paymentType: "manual",
        stripePriceIdMonthly: "",
        stripePriceIdYearly: "",
        messagesPerDay: 50,
        messagesPerMonth: 1000,
        imagesPerDay: 5,
        imagesPerMonth: 50,
        maxActiveChats: 5,
      });
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = plan ? `/api/admin/plans/${plan.id}` : "/api/admin/plans";
      const method = plan ? "PATCH" : "POST";

      const payload: any = {
        name: formData.name,
        slug: formData.slug,
        displayName: formData.displayName,
        description: formData.description,
        pricing: formData.pricing,
        paymentType: formData.paymentType,
        stripePriceIdMonthly: formData.stripePriceIdMonthly || null,
        stripePriceIdYearly: formData.stripePriceIdYearly || null,
        adminSettings: {
          isActive: formData.isActive,
          isVisible: formData.isVisible,
          isFeatured: formData.isFeatured,
        },
        metadata: {
          order: formData.order,
        },
        limits: {
          chats: { maxActive: formData.maxActiveChats, maxHistory: 50 },
          messages: {
            maxPerChat: 100,
            maxPerDay: formData.messagesPerDay,
            maxPerMonth: formData.messagesPerMonth,
          },
          images: {
            maxPerDay: formData.imagesPerDay,
            maxPerMonth: formData.imagesPerMonth,
          },
          files: {
            maxSize: 5242880,
            maxCount: 3,
            allowedTypes: ["pdf", "txt", "md"],
          },
          api: { rateLimit: 10, burstLimit: 20 },
        },
      };

      if (!plan) {
        payload.models = {
          allowed: ["gpt-3.5-turbo"],
          default: "gpt-3.5-turbo",
          limits: {},
        };
        payload.features = {
          mcpServers: { enabled: false, maxServers: 0, customServers: false },
          workflows: { enabled: false, maxWorkflows: 0 },
          agents: { enabled: false, maxCustomAgents: 0, shareAgents: false },
          advanced: {
            codeInterpreter: false,
            imageGeneration: false,
            voiceChat: false,
            documentAnalysis: false,
            apiAccess: false,
            prioritySupport: false,
            teamWorkspace: false,
            exportData: false,
          },
        };
        payload.adminSettings = {
          ...payload.adminSettings,
          allowSignup: true,
          maxUsers: null,
          trialDays: 0,
        };
        payload.metadata = {
          ...payload.metadata,
          color: "gray",
          icon: "package",
        };
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(plan ? t("planUpdated") : t("planCreated"));
        onOpenChange(false);
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || t("saveFailed"));
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(t("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {plan ? t("editPlan") : t("createPlan")}
            </DialogTitle>
            <DialogDescription>
              {plan ? t("editDescription") : t("createDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">{t("planSettings")}</TabsTrigger>
                <TabsTrigger value="pricing">{t("pricing")}</TabsTrigger>
                <TabsTrigger value="limits">Limits</TabsTrigger>
                <TabsTrigger value="settings">{t("visibility")}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("planName")} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="e.g. Pro Plan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                      placeholder="e.g. pro"
                      disabled={!!plan}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayNameEn">{t("planName")} (EN) *</Label>
                    <Input
                      id="displayNameEn"
                      value={formData.displayName.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayName: { ...formData.displayName, en: e.target.value },
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayNameAr">{t("planName")} (AR) *</Label>
                    <Input
                      id="displayNameAr"
                      value={formData.displayName.ar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayName: { ...formData.displayName, ar: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">{t("planDescription")} (EN)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.description.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: { ...formData.description, en: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionAr">{t("planDescription")} (AR)</Label>
                    <Textarea
                      id="descriptionAr"
                      value={formData.description.ar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: { ...formData.description, ar: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly">{t("planPrice")} ({t("monthly")}) *</Label>
                    <Input
                      id="monthly"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricing.monthly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, monthly: parseFloat(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearly">{t("planPrice")} ({t("yearly")})</Label>
                    <Input
                      id="yearly"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricing.yearly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, yearly: parseFloat(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Input
                    id="currency"
                    value={formData.pricing.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: { ...formData.pricing, currency: e.target.value },
                      })
                    }
                    required
                    placeholder="USD"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select
                    value={formData.paymentType}
                    onValueChange={(val) =>
                      setFormData({ ...formData, paymentType: val as "manual" | "stripe" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentType === "stripe" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripePriceIdMonthly">Stripe Price ID (Monthly)</Label>
                      <Input
                        id="stripePriceIdMonthly"
                        value={formData.stripePriceIdMonthly}
                        onChange={(e) =>
                          setFormData({ ...formData, stripePriceIdMonthly: e.target.value })
                        }
                        placeholder="price_xxx"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stripePriceIdYearly">Stripe Price ID (Yearly)</Label>
                      <Input
                        id="stripePriceIdYearly"
                        value={formData.stripePriceIdYearly}
                        onChange={(e) =>
                          setFormData({ ...formData, stripePriceIdYearly: e.target.value })
                        }
                        placeholder="price_xxx"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="limits" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="messagesPerDay">Messages / Day</Label>
                    <Input
                      id="messagesPerDay"
                      type="number"
                      min="0"
                      value={formData.messagesPerDay}
                      onChange={(e) =>
                        setFormData({ ...formData, messagesPerDay: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="messagesPerMonth">Messages / Month</Label>
                    <Input
                      id="messagesPerMonth"
                      type="number"
                      min="0"
                      value={formData.messagesPerMonth}
                      onChange={(e) =>
                        setFormData({ ...formData, messagesPerMonth: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagesPerDay">Images / Day</Label>
                    <Input
                      id="imagesPerDay"
                      type="number"
                      min="0"
                      value={formData.imagesPerDay}
                      onChange={(e) =>
                        setFormData({ ...formData, imagesPerDay: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagesPerMonth">Images / Month</Label>
                    <Input
                      id="imagesPerMonth"
                      type="number"
                      min="0"
                      value={formData.imagesPerMonth}
                      onChange={(e) =>
                        setFormData({ ...formData, imagesPerMonth: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxActiveChats">Max Active Chats</Label>
                    <Input
                      id="maxActiveChats"
                      type="number"
                      min="1"
                      value={formData.maxActiveChats}
                      onChange={(e) =>
                        setFormData({ ...formData, maxActiveChats: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="order">{t("planDuration")} *</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{tCommon("active")}</Label>
                      <p className="text-sm text-muted-foreground">
                        Make plan available for selection
                      </p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Visible</Label>
                      <p className="text-sm text-muted-foreground">
                        Show this plan on pricing page
                      </p>
                    </div>
                    <Switch
                      checked={formData.isVisible}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isVisible: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Featured</Label>
                      <p className="text-sm text-muted-foreground">
                        Mark as popular/recommended
                      </p>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFeatured: checked })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tCommon("saving")}
                </>
              ) : plan ? (
                tCommon("update")
              ) : (
                tCommon("create")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
