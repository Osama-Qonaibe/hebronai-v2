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
import { Loader2, Info, Zap, Users, Bot, Crown, Image as ImageIcon, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/types/subscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import { Slider } from "ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "ui/card";
import { Checkbox } from "ui/checkbox";
import { getModelDisplayName } from "@/lib/ai/model-display-names";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

interface AIModel {
  value: string;
  label: string;
  provider: string;
  modelName: string;
  isToolCallUnsupported: boolean;
  isImageInputUnsupported: boolean;
  supportedFileMimeTypes: string[];
}

const IMAGE_RESOLUTIONS = [
  { value: "256x256", label: "256×256 (Low)" },
  { value: "512x512", label: "512×512 (Medium)" },
  { value: "1024x1024", label: "1024×1024 (High)" },
  { value: "1792x1024", label: "1792×1024 (Wide)" },
  { value: "1024x1792", label: "1024×1792 (Tall)" },
];

const DEFAULT_PLAN_DATA = {
  name: "",
  slug: "",
  displayName: { en: "", ar: "" },
  description: { en: "", ar: "" },
  pricing: { monthly: 0, yearly: 0, currency: "USD" },
  models: {
    allowed: [] as string[],
    default: "",
    limits: {} as Record<string, any>,
  },
  limits: {
    chats: { maxActive: 5, maxHistory: 50 },
    messages: { maxPerChat: 100, maxPerDay: 50, maxPerMonth: 1000 },
    files: {
      maxSize: 5242880,
      maxCount: 3,
      allowedTypes: ["pdf", "txt", "md"],
    },
    images: {
      maxPerDay: 10,
      maxPerMonth: 100,
      maxResolution: "1024x1024",
    },
    api: { rateLimit: 10, burstLimit: 20 },
  },
  features: {
    mcpServers: { enabled: false, maxServers: 0, customServers: false },
    workflows: { enabled: false, maxWorkflows: 0 },
    agents: {
      enabled: false,
      maxCustomAgents: 0,
      shareAgents: false,
    },
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
  },
  adminSettings: {
    isActive: true,
    isVisible: true,
    isFeatured: false,
    allowSignup: true,
    maxUsers: null as number | null,
    trialDays: 0,
  },
  metadata: {
    order: 1,
    color: "#6366f1",
    icon: "package",
  },
};

export function PlanDialogEnhanced({ open, onOpenChange, plan }: PlanDialogProps) {
  const t = useTranslations("Admin.Plans");
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_PLAN_DATA);

  useEffect(() => {
    if (open) {
      fetchAvailableModels();
    }
  }, [open]);

  useEffect(() => {
    if (plan) {
      const mergedData = {
        ...DEFAULT_PLAN_DATA,
        ...plan,
        limits: {
          ...DEFAULT_PLAN_DATA.limits,
          ...plan.limits,
          images: {
            ...DEFAULT_PLAN_DATA.limits.images,
            ...(plan.limits?.images || {}),
          },
        },
      };
      setFormData(mergedData);
    } else {
      setFormData(DEFAULT_PLAN_DATA);
    }
  }, [plan, open]);

  const fetchAvailableModels = async () => {
    setLoadingModels(true);
    try {
      const response = await fetch("/api/admin/models");
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error(t("failedToLoadModels"));
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = plan ? `/api/admin/plans/${plan.id}` : "/api/admin/plans";
      const method = plan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(plan ? t("planUpdated") : t("planCreated"));
        onOpenChange(false);
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || t("failedToSavePlan"));
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(t("failedToSavePlan"));
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = (modelValue: string) => {
    const allowed = formData.models.allowed.includes(modelValue)
      ? formData.models.allowed.filter((m) => m !== modelValue)
      : [...formData.models.allowed, modelValue];
    
    let defaultModel = formData.models.default;
    if (!allowed.includes(defaultModel) && allowed.length > 0) {
      defaultModel = allowed[0];
    }

    setFormData({
      ...formData,
      models: { ...formData.models, allowed, default: defaultModel },
    });
  };

  const groupedModels = availableModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {plan ? t("editPlan") : t("createPlan")}
            </DialogTitle>
            <DialogDescription>
              {plan ? t("editPlanDescription") : t("createPlanDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">
                  <Info className="h-4 w-4 mr-2" />
                  {t("basicTab")}
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  {t("pricingTab")}
                </TabsTrigger>
                <TabsTrigger value="models">
                  <Zap className="h-4 w-4 mr-2" />
                  {t("modelsTab")}
                </TabsTrigger>
                <TabsTrigger value="features">
                  <Bot className="h-4 w-4 mr-2" />
                  {t("featuresTab")}
                </TabsTrigger>
                <TabsTrigger value="limits">
                  <Users className="h-4 w-4 mr-2" />
                  {t("limitsTab")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("internalName")}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Pro Plan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="pro"
                      disabled={!!plan}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("displayNameEn")}</Label>
                    <Input
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
                    <Label>{t("displayNameAr")}</Label>
                    <Input
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
                    <Label>{t("descriptionEn")}</Label>
                    <Textarea
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
                    <Label>{t("descriptionAr")}</Label>
                    <Textarea
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("order")}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.metadata.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, order: parseInt(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("color")}</Label>
                    <Input
                      type="color"
                      value={formData.metadata.color}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, color: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("icon")}</Label>
                    <Input
                      value={formData.metadata.icon}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, icon: e.target.value },
                        })
                      }
                      placeholder="package"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("activeLabel")}</Label>
                      <p className="text-sm text-muted-foreground">{t("activeDescription")}</p>
                    </div>
                    <Switch
                      checked={formData.adminSettings.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          adminSettings: { ...formData.adminSettings, isActive: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("visibleLabel")}</Label>
                      <p className="text-sm text-muted-foreground">{t("visibleDescription")}</p>
                    </div>
                    <Switch
                      checked={formData.adminSettings.isVisible}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          adminSettings: { ...formData.adminSettings, isVisible: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("featuredLabel")}</Label>
                      <p className="text-sm text-muted-foreground">{t("featuredDescription")}</p>
                    </div>
                    <Switch
                      checked={formData.adminSettings.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          adminSettings: { ...formData.adminSettings, isFeatured: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("monthlyYearlyPricing")}</CardTitle>
                    <CardDescription>
                      {t("monthlyPricingDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("monthlyPrice")}</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.pricing.monthly}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricing: { ...formData.pricing, monthly: parseFloat(e.target.value) || 0 },
                            })
                          }
                          required
                          placeholder="9.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("yearlyPrice")}</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.pricing.yearly}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pricing: { ...formData.pricing, yearly: parseFloat(e.target.value) || 0 },
                            })
                          }
                          required
                          placeholder="99.99"
                        />
                      </div>
                    </div>
                    {formData.pricing.monthly > 0 && formData.pricing.yearly > 0 && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        💡 {t("yearlyDiscount").replace("{percent}", ((1 - formData.pricing.yearly / (formData.pricing.monthly * 12)) * 100).toFixed(0))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("trialSettings")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("trialDays")}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="90"
                        value={formData.adminSettings.trialDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adminSettings: {
                              ...formData.adminSettings,
                              trialDays: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("trialDaysHint")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("userLimit")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("maxUsersLabel")}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.adminSettings.maxUsers || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            adminSettings: {
                              ...formData.adminSettings,
                              maxUsers: e.target.value ? parseInt(e.target.value) : null,
                            },
                          })
                        }
                        placeholder={t("unlimitedValue")}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("maxUsersHint")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="models" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t("availableModels")}</span>
                      {loadingModels && <Loader2 className="h-4 w-4 animate-spin" />}
                    </CardTitle>
                    <CardDescription>
                      {t("modelsLoadedDynamically")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingModels ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("loadingModels")}
                      </div>
                    ) : availableModels.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("noModels")}
                      </div>
                    ) : (
                      Object.entries(groupedModels).map(([provider, models]) => (
                        <div key={provider} className="space-y-2">
                          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {provider}
                          </div>
                          <div className="space-y-2">
                            {models.map((model) => (
                              <div
                                key={model.value}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-center space-x-3 space-x-reverse">
                                  <Checkbox
                                    checked={formData.models.allowed.includes(model.value)}
                                    onCheckedChange={() => toggleModel(model.value)}
                                  />
                                  <div>
                                    <div className="font-medium">{getModelDisplayName(model.modelName)}</div>
                                    {(model.isToolCallUnsupported || model.isImageInputUnsupported) && (
                                      <div className="text-xs text-muted-foreground">
                                        {model.isToolCallUnsupported && t("noToolsSupport")}
                                        {model.isImageInputUnsupported && " " + t("noImageSupport")}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {formData.models.default === model.value && (
                                  <div className="flex items-center gap-1 text-xs text-primary">
                                    <Check className="h-3 w-3" />
                                    {t("defaultBadge")}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {formData.models.allowed.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("defaultModel")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={formData.models.default}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            models: { ...formData.models, default: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.models.allowed.map((modelValue) => {
                            const model = availableModels.find((m) => m.value === modelValue);
                            return (
                              <SelectItem key={modelValue} value={modelValue}>
                                {model?.label ? getModelDisplayName(model.label) : modelValue}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("mcpServersCard")}</CardTitle>
                    <CardDescription>
                      {t("mcpServersCardDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("enableMcpServers")}</Label>
                      <Switch
                        checked={formData.features.mcpServers.enabled}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              mcpServers: { ...formData.features.mcpServers, enabled: checked },
                            },
                          })
                        }
                      />
                    </div>
                    {formData.features.mcpServers.enabled && (
                      <>
                        <div className="space-y-2">
                          <Label>{t("serverCount").replace("{count}", formData.features.mcpServers.maxServers.toString())}</Label>
                          <Slider
                            value={[formData.features.mcpServers.maxServers]}
                            onValueChange={([value]) =>
                              setFormData({
                                ...formData,
                                features: {
                                  ...formData.features,
                                  mcpServers: { ...formData.features.mcpServers, maxServers: value },
                                },
                              })
                            }
                            max={20}
                            step={1}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>{t("allowCustomServers")}</Label>
                          <Switch
                            checked={formData.features.mcpServers.customServers}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                features: {
                                  ...formData.features,
                                  mcpServers: { ...formData.features.mcpServers, customServers: checked },
                                },
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("workflowsCard")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("enableWorkflows")}</Label>
                      <Switch
                        checked={formData.features.workflows.enabled}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              workflows: { ...formData.features.workflows, enabled: checked },
                            },
                          })
                        }
                      />
                    </div>
                    {formData.features.workflows.enabled && (
                      <div className="space-y-2">
                        <Label>{t("workflowCount").replace("{count}", formData.features.workflows.maxWorkflows.toString())}</Label>
                        <Slider
                          value={[formData.features.workflows.maxWorkflows]}
                          onValueChange={([value]) =>
                            setFormData({
                              ...formData,
                              features: {
                                ...formData.features,
                                workflows: { ...formData.features.workflows, maxWorkflows: value },
                              },
                            })
                          }
                          max={50}
                          step={5}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("agentsCard")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("enableAgents")}</Label>
                      <Switch
                        checked={formData.features.agents.enabled}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              agents: { ...formData.features.agents, enabled: checked },
                            },
                          })
                        }
                      />
                    </div>
                    {formData.features.agents.enabled && (
                      <>
                        <div className="space-y-2">
                          <Label>{t("agentCount").replace("{count}", formData.features.agents.maxCustomAgents.toString())}</Label>
                          <Slider
                            value={[formData.features.agents.maxCustomAgents]}
                            onValueChange={([value]) =>
                              setFormData({
                                ...formData,
                                features: {
                                  ...formData.features,
                                  agents: { ...formData.features.agents, maxCustomAgents: value },
                                },
                              })
                            }
                            max={20}
                            step={1}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>{t("shareAgents")}</Label>
                          <Switch
                            checked={formData.features.agents.shareAgents}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                features: {
                                  ...formData.features,
                                  agents: { ...formData.features.agents, shareAgents: checked },
                                },
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("advancedFeatures")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t("codeInterpreter")}</Label>
                      <Switch
                        checked={formData.features.advanced.codeInterpreter}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, codeInterpreter: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("imageGeneration")}</Label>
                      <Switch
                        checked={formData.features.advanced.imageGeneration}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, imageGeneration: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("voiceChat")}</Label>
                      <Switch
                        checked={formData.features.advanced.voiceChat}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, voiceChat: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("documentAnalysis")}</Label>
                      <Switch
                        checked={formData.features.advanced.documentAnalysis}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, documentAnalysis: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("apiAccess")}</Label>
                      <Switch
                        checked={formData.features.advanced.apiAccess}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, apiAccess: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("prioritySupport")}</Label>
                      <Switch
                        checked={formData.features.advanced.prioritySupport}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, prioritySupport: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("teamWorkspace")}</Label>
                      <Switch
                        checked={formData.features.advanced.teamWorkspace}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, teamWorkspace: checked },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>{t("exportData")}</Label>
                      <Switch
                        checked={formData.features.advanced.exportData}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            features: {
                              ...formData.features,
                              advanced: { ...formData.features.advanced, exportData: checked },
                            },
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="limits" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("chatLimits")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("activeChats").replace("{count}", formData.limits.chats.maxActive.toString())}</Label>
                      <Slider
                        value={[formData.limits.chats.maxActive]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              chats: { ...formData.limits.chats, maxActive: value },
                            },
                          })
                        }
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("chatHistory").replace("{count}", formData.limits.chats.maxHistory.toString())}</Label>
                      <Slider
                        value={[formData.limits.chats.maxHistory]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              chats: { ...formData.limits.chats, maxHistory: value },
                            },
                          })
                        }
                        max={500}
                        step={10}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("messageLimits")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("messagesPerChat").replace("{count}", formData.limits.messages.maxPerChat.toString())}</Label>
                      <Slider
                        value={[formData.limits.messages.maxPerChat]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              messages: { ...formData.limits.messages, maxPerChat: value },
                            },
                          })
                        }
                        max={1000}
                        step={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("messagesPerDay").replace("{count}", formData.limits.messages.maxPerDay.toString())}</Label>
                      <Slider
                        value={[formData.limits.messages.maxPerDay]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              messages: { ...formData.limits.messages, maxPerDay: value },
                            },
                          })
                        }
                        max={1000}
                        step={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("messagesPerMonth").replace("{count}", formData.limits.messages.maxPerMonth.toString())}</Label>
                      <Slider
                        value={[formData.limits.messages.maxPerMonth]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              messages: { ...formData.limits.messages, maxPerMonth: value },
                            },
                          })
                        }
                        max={10000}
                        step={500}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      {t("imageLimits")}
                    </CardTitle>
                    <CardDescription>
                      {formData.features.advanced.imageGeneration 
                        ? t("imageLimitsDesc") 
                        : t("imageLimitsDisabledDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.features.advanced.imageGeneration ? (
                      <>
                        <div className="space-y-2">
                          <Label>{t("imagesPerDay").replace("{count}", (formData.limits.images?.maxPerDay || 10).toString())}</Label>
                          <Slider
                            value={[formData.limits.images?.maxPerDay || 10]}
                            onValueChange={([value]) =>
                              setFormData({
                                ...formData,
                                limits: {
                                  ...formData.limits,
                                  images: { ...formData.limits.images, maxPerDay: value },
                                },
                              })
                            }
                            max={500}
                            step={10}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("imagesPerMonth").replace("{count}", (formData.limits.images?.maxPerMonth || 100).toString())}</Label>
                          <Slider
                            value={[formData.limits.images?.maxPerMonth || 100]}
                            onValueChange={([value]) =>
                              setFormData({
                                ...formData,
                                limits: {
                                  ...formData.limits,
                                  images: { ...formData.limits.images, maxPerMonth: value },
                                },
                              })
                            }
                            max={5000}
                            step={100}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("maxResolution")}</Label>
                          <Select
                            value={formData.limits.images?.maxResolution || "1024x1024"}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                limits: {
                                  ...formData.limits,
                                  images: { ...formData.limits.images, maxResolution: value },
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {IMAGE_RESOLUTIONS.map((res) => (
                                <SelectItem key={res.value} value={res.value}>
                                  {res.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        {t("enableImageGenerationFirst")}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("fileLimits")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        {t("fileSize").replace("{size}", (formData.limits.files.maxSize / 1048576).toFixed(1))}
                      </Label>
                      <Slider
                        value={[formData.limits.files.maxSize / 1048576]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              files: {
                                ...formData.limits.files,
                                maxSize: Math.round(value * 1048576),
                              },
                            },
                          })
                        }
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fileCount").replace("{count}", formData.limits.files.maxCount.toString())}</Label>
                      <Slider
                        value={[formData.limits.files.maxCount]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              files: { ...formData.limits.files, maxCount: value },
                            },
                          })
                        }
                        max={50}
                        step={1}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("apiLimits")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rate Limit: {formData.limits.api.rateLimit}/min</Label>
                      <Slider
                        value={[formData.limits.api.rateLimit]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              api: { ...formData.limits.api, rateLimit: value },
                            },
                          })
                        }
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Burst Limit: {formData.limits.api.burstLimit}</Label>
                      <Slider
                        value={[formData.limits.api.burstLimit]}
                        onValueChange={([value]) =>
                          setFormData({
                            ...formData,
                            limits: {
                              ...formData.limits,
                              api: { ...formData.limits.api, burstLimit: value },
                            },
                          })
                        }
                        max={200}
                        step={10}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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