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
import { Loader2, Info, Zap, Users, Workflow, Bot, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SubscriptionPlan } from "@/types/subscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import { Slider } from "ui/slider";
import { Badge } from "ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "ui/card";

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

const AVAILABLE_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
];

export function PlanDialogEnhanced({ open, onOpenChange, plan }: PlanDialogProps) {
  const t = useTranslations("Admin.Plans");
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    displayName: { en: "", ar: "" },
    description: { en: "", ar: "" },
    pricing: { monthly: 0, yearly: 0, currency: "USD" },
    models: {
      allowed: ["gpt-3.5-turbo"],
      default: "gpt-3.5-turbo",
      limits: {} as Record<string, number>,
    },
    limits: {
      chats: { maxActive: 5, maxHistory: 50 },
      messages: { maxPerChat: 100, maxPerDay: 50, maxPerMonth: 1000 },
      files: {
        maxSize: 5242880,
        maxCount: 3,
        allowedTypes: ["pdf", "txt", "md"],
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
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        slug: plan.slug,
        displayName: plan.displayName,
        description: plan.description,
        pricing: plan.pricing,
        models: plan.models,
        limits: plan.limits,
        features: plan.features,
        adminSettings: plan.adminSettings,
        metadata: plan.metadata,
      });
    }
  }, [plan, open]);

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
        toast.error(error.error || "Failed to save plan");
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = (model: string) => {
    const allowed = formData.models.allowed.includes(model)
      ? formData.models.allowed.filter((m) => m !== model)
      : [...formData.models.allowed, model];
    setFormData({
      ...formData,
      models: { ...formData.models, allowed },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {plan ? t("editPlan") : t("createPlan")}
            </DialogTitle>
            <DialogDescription>
              {plan ? "تعديل إعدادات الخطة بالكامل" : "إنشاء خطة جديدة مع تحكم كامل بالميزات"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">
                  <Info className="h-4 w-4 mr-2" />
                  أساسي
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  التسعير
                </TabsTrigger>
                <TabsTrigger value="models">
                  <Zap className="h-4 w-4 mr-2" />
                  النماذج
                </TabsTrigger>
                <TabsTrigger value="features">
                  <Bot className="h-4 w-4 mr-2" />
                  الميزات
                </TabsTrigger>
                <TabsTrigger value="limits">
                  <Users className="h-4 w-4 mr-2" />
                  الحدود
                </TabsTrigger>
              </TabsList>

              {/* Basic Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم داخلي *</Label>
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
                    <Label>اسم العرض (EN) *</Label>
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
                    <Label>اسم العرض (AR) *</Label>
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
                    <Label>الوصف (EN)</Label>
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
                    <Label>الوصف (AR)</Label>
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
                    <Label>الترتيب *</Label>
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
                    <Label>اللون</Label>
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
                    <Label>الأيقونة</Label>
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
                      <Label>نشط</Label>
                      <p className="text-sm text-muted-foreground">متاح للمستخدمين</p>
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
                      <Label>ظاهر</Label>
                      <p className="text-sm text-muted-foreground">يظهر في صفحة الأسعار</p>
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
                      <Label>مميز (Popular)</Label>
                      <p className="text-sm text-muted-foreground">إضافة علامة "الأكثر شعبية"</p>
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

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>السعر الشهري *</Label>
                    <Input
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
                    <Label>السعر السنوي</Label>
                    <Input
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
                    {formData.pricing.yearly > 0 && formData.pricing.monthly > 0 && (
                      <p className="text-xs text-green-600">
                        وفّر{" "}
                        {Math.round(
                          ((formData.pricing.monthly * 12 - formData.pricing.yearly) /
                            (formData.pricing.monthly * 12)) *
                            100
                        )}
                        %
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>العملة *</Label>
                    <Input
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
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>السماح بالتسجيل</Label>
                    <Switch
                      checked={formData.adminSettings.allowSignup}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          adminSettings: { ...formData.adminSettings, allowSignup: checked },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>أيام التجربة المجانية</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.adminSettings.trialDays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminSettings: {
                            ...formData.adminSettings,
                            trialDays: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الحد الأقصى للمستخدمين</Label>
                  <Input
                    type="number"
                    min="1"
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
                    placeholder="غير محدود"
                  />
                </div>
              </TabsContent>

              {/* Models Tab */}
              <TabsContent value="models" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">النماذج المتاحة</CardTitle>
                    <CardDescription>اختر النماذج التي يمكن للمستخدمين استخدامها</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {AVAILABLE_MODELS.map((model) => (
                      <div key={model.value} className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          {model.label}
                          {formData.models.default === model.value && (
                            <Badge variant="secondary">افتراضي</Badge>
                          )}
                        </Label>
                        <Switch
                          checked={formData.models.allowed.includes(model.value)}
                          onCheckedChange={() => toggleModel(model.value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">النموذج الافتراضي</CardTitle>
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
                        {formData.models.allowed.map((model) => (
                          <SelectItem key={model} value={model}>
                            {AVAILABLE_MODELS.find((m) => m.value === model)?.label || model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تفعيل الوكلاء</Label>
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
                          <Label>الحد الأقصى: {formData.features.agents.maxCustomAgents}</Label>
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
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>مشاركة الوكلاء</Label>
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      Workflows
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تفعيل سير العمل</Label>
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
                        <Label>الحد الأقصى: {formData.features.workflows.maxWorkflows}</Label>
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
                          step={1}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">MCP Servers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تفعيل MCP</Label>
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
                          <Label>الحد الأقصى: {formData.features.mcpServers.maxServers}</Label>
                          <Slider
                            value={[formData.features.mcpServers.maxServers]}
                            onValueChange={([value]) =>
                              setFormData({
                                ...formData,
                                features: {
                                  ...formData.features,
                                  mcpServers: {
                                    ...formData.features.mcpServers,
                                    maxServers: value,
                                  },
                                },
                              })
                            }
                            max={20}
                            step={1}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>سيرفرات مخصصة</Label>
                          <Switch
                            checked={formData.features.mcpServers.customServers}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                features: {
                                  ...formData.features,
                                  mcpServers: {
                                    ...formData.features.mcpServers,
                                    customServers: checked,
                                  },
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
                    <CardTitle className="text-lg">ميزات متقدمة</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {Object.entries(formData.features.advanced).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              features: {
                                ...formData.features,
                                advanced: { ...formData.features.advanced, [key]: checked },
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Limits Tab */}
              <TabsContent value="limits" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>حدود المحادثات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>محادثات نشطة: {formData.limits.chats.maxActive}</Label>
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
                      <Label>سجل المحادثات: {formData.limits.chats.maxHistory}</Label>
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
                    <CardTitle>حدود الرسائل</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>رسائل لكل محادثة: {formData.limits.messages.maxPerChat}</Label>
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
                      <Label>رسائل يومياً: {formData.limits.messages.maxPerDay}</Label>
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
                      <Label>رسائل شهرياً: {formData.limits.messages.maxPerMonth}</Label>
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
                    <CardTitle>حدود الملفات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        حجم الملف: {(formData.limits.files.maxSize / 1048576).toFixed(1)} MB
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
                      <Label>عدد الملفات: {formData.limits.files.maxCount}</Label>
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
                    <CardTitle>حدود API</CardTitle>
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
