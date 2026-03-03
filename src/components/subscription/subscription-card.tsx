"use client";

import { useState } from "react";
import { Button } from "ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/card";
import { Badge } from "ui/badge";
import {
  Check,
  Sparkles,
  Copy,
  CheckCheck,
  MessageCircle,
  Send,
  Loader2,
  Bot,
  MessageSquare,
  Zap,
  Image as ImageIcon,
  HardDrive,
  Infinity,
} from "lucide-react";
import { getPaymentLink, getBankTransferDetails } from "@/lib/payment/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui/dialog";
import { Label } from "ui/label";
import { RadioGroup, RadioGroupItem } from "ui/radio-group";
import { Alert, AlertDescription } from "ui/alert";
import { Input } from "ui/input";
import { Textarea } from "ui/textarea";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { usePlans } from "@/hooks/use-plans";
import { Separator } from "ui/separator";

type SubscriptionStatus = "active" | "expired" | "cancelled" | "trial";
type PaymentMethod = "stripe" | "paypal" | "bank_transfer" | "manual";
type SubscriptionType = "monthly" | "yearly";

interface SubscriptionCardProps {
  currentPlan: string;
  currentStatus: SubscriptionStatus;
  expiresAt: Date | null;
  isActive: boolean;
  pendingRequest?: any | null;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatNumber(num: number, locale: string): string {
  if (num === -1) return locale === 'ar' ? 'غير محدود' : 'Unlimited';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
}

function formatStorage(gb: number, locale: string): string {
  if (gb === -1) return locale === 'ar' ? 'غير محدود' : 'Unlimited';
  if (gb < 1) {
    return `${(gb * 1024).toFixed(0)} MB`;
  }
  if (gb > 100) {
    return `100+ GB`;
  }
  return `${gb} GB`;
}

function calculatePercentageIncrease(current: number, base: number): number {
  if (base === 0 || base === -1 || current === -1) return 0;
  return Math.round(((current - base) / base) * 100);
}

const LEGACY_PLANS = ["free", "basic", "pro", "enterprise"];

export function SubscriptionCard({
  currentPlan,
  currentStatus,
  expiresAt,
  isActive,
  pendingRequest,
}: SubscriptionCardProps) {
  const t = useTranslations("Subscription");
  const locale = useLocale();
  const { plans, loading: plansLoading } = usePlans();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");

  const bankDetails = getBankTransferDetails();
  const WHATSAPP_NUMBER = "+972534414330";

  const handleUpgradeClick = (planSlug: string) => {
    if (planSlug === currentPlan) return;

    if (pendingRequest) {
      toast.error(
        t("pendingRequestAlert", { plan: pendingRequest.requestedPlan }),
      );
      return;
    }

    setSelectedPlan(planSlug);
    setSubscriptionType("monthly");
    setTransactionId("");
    setNotes("");
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const planDetails = plans.find((p) => p.slug === selectedPlan);
      if (!planDetails) {
        throw new Error("Invalid plan selection");
      }

      const amount = subscriptionType === "yearly" 
        ? planDetails.pricing.yearly 
        : planDetails.pricing.monthly;

      const response = await fetch("/api/user/subscription-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlan: selectedPlan,
          subscriptionType,
          paymentMethod,
          amount,
          currency: planDetails.pricing.currency,
          transactionId: transactionId || undefined,
          notes:
            notes ||
            `Payment method: ${getPaymentMethodArabic(paymentMethod)}`,
        }),
      });

      if (response.ok) {
        const isLegacyPlan = LEGACY_PLANS.includes(selectedPlan) && selectedPlan !== 'free';
        const shouldRedirectToGateway = isLegacyPlan && (paymentMethod === "paypal" || paymentMethod === "stripe");

        if (shouldRedirectToGateway) {
          const link = getPaymentLink(
            paymentMethod as "paypal" | "stripe",
            selectedPlan as "basic" | "pro",
          );

          toast.success("✅ تم إرسال الطلب", {
            description: "سيتم فتح بوابة الدفع الآن...",
          });

          setTimeout(() => {
            if (link) {
              window.location.href = link;
            }
          }, 1500);
        } else if (paymentMethod === "bank_transfer") {
          toast.success("✅ تم إرسال الطلب", {
            description:
              "سيتم التحقق من رقم المعاملة والموافقة على الطلب قريباً.",
          });
        } else {
          toast.success("✅ تم إرسال الطلب", {
            description: "سيتم مراجعة طلبك والتواصل معك لإتمام عملية الدفع.",
          });
        }

        setSelectedPlan(null);
        setSubscriptionType("monthly");
        setTransactionId("");
        setNotes("");

        if (!shouldRedirectToGateway) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const error = await response.json();
        toast.error("خطأ", {
          description: error.error || "فشل في إرسال الطلب. حاول مرة أخرى.",
        });
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("خطأ", {
        description: "فشل في إرسال الطلب. حاول مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("✅ تم النسخ");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("فشل في النسخ");
    }
  };

  const handleEnterpriseContact = () => {
    const message = encodeURIComponent(
      `مرحباً، أرغب في الاستفسار عن خطة Enterprise للشركات.\\n\\nأود معرفة المزيد عن المميزات والأسعار المخصصة.`,
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  const handleWhatsAppContact = () => {
    if (!selectedPlan) return;

    const planDetails = plans.find((p) => p.slug === selectedPlan);
    if (!planDetails) return;

    const planName = locale === 'ar' 
      ? (planDetails.displayName.ar || planDetails.displayName.en)
      : (planDetails.displayName.en || planDetails.displayName.ar);
    const price = subscriptionType === "yearly" ? planDetails.pricing.yearly : planDetails.pricing.monthly;
    const period = subscriptionType === "yearly" ? "سنة" : "شهر";
    const message = encodeURIComponent(
      `مرحباً، أرغب في الترقية إلى خطة ${planName} ($${price}/${period}).\\n\\nطريقة الدفع: ${getPaymentMethodArabic(paymentMethod)}\\n\\nأحتاج مساعدة.`,
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  function getPaymentMethodArabic(method: PaymentMethod): string {
    const methods = {
      paypal: "PayPal",
      stripe: "Stripe (Card)",
      bank_transfer: "تحويل بنكي",
      manual: "دفع يدوي عبر المشرف",
    };
    return methods[method] || method;
  }

  const activePlans = plans.filter(
    (p) => p.adminSettings.isActive && p.adminSettings.isVisible,
  );
  const selectedPlanDetails = plans.find((p) => p.slug === selectedPlan);
  const isEnterprisePlan = selectedPlan === "enterprise";
  const isCustomPlan = selectedPlan && !LEGACY_PLANS.includes(selectedPlan);
  const hasYearlyPrice = selectedPlanDetails?.pricing.yearly && selectedPlanDetails.pricing.yearly > 0;
  const showDurationOptions = isCustomPlan && hasYearlyPrice && !isEnterprisePlan;
  const showBankFields = paymentMethod === "bank_transfer" && !isEnterprisePlan;
  const showManualNotes = paymentMethod === "manual" && !isEnterprisePlan;
  const canSubmit = !loading && (!showBankFields || transactionId.trim().length > 0);

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const freePlan = activePlans.find(p => p.slug === 'free');

  return (
    <>
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t("currentPlan")}</CardTitle>
            <CardDescription>
              {t("youAreOnPlan")} <strong>{t(`plans.${currentPlan}`)}</strong>
              {expiresAt && (
                <span>
                  {" "}
                  - {t("expires")} {formatDate(expiresAt)}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={isActive ? "default" : "destructive"}>
              {currentStatus}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {activePlans.map((plan) => {
            const isCurrent = plan.slug === currentPlan;
            const isFeatured = plan.metadata?.badge === "Popular";
            const displayName = locale === 'ar'
              ? (plan.displayName.ar || plan.displayName.en)
              : (plan.displayName.en || plan.displayName.ar);
            const priceDisplay =
              plan.pricing.monthly === 0
                ? "$0"
                : plan.pricing.monthly > 0
                  ? `$${plan.pricing.monthly}`
                  : locale === 'ar' ? 'مخصص' : 'Custom';

            const maxChats = plan.limits.chats?.maxActive || 0;
            const maxMessages = plan.limits.messages?.maxPerMonth || 0;
            const maxMCP = plan.features.mcpServers?.maxServers || 0;
            const maxWorkflows = plan.features.workflows?.maxWorkflows || 0;
            const maxImages = (plan.limits.images?.maxPerDay || 0);
            const maxImagesMonth = (plan.limits.images?.maxPerMonth || 0);
            const maxStorage = (plan.limits.files?.maxSize || 0) / 1024;

            const baseChats = freePlan?.limits.chats?.maxActive || 2;
            const baseMessages = freePlan?.limits.messages?.maxPerMonth || 50000;

            const chatsIncrease = calculatePercentageIncrease(maxChats, baseChats);
            const messagesIncrease = calculatePercentageIncrease(maxMessages, baseMessages);

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  isFeatured ? "border-primary shadow-lg" : ""
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      {locale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{displayName}</CardTitle>
                    <div className="text-3xl font-bold">
                      {priceDisplay}
                      {plan.pricing.monthly > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /{locale === 'ar' ? 'شهر' : 'month'}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Bot className="h-4 w-4" />
                        {locale === 'ar' ? 'النماذج المتاحة' : 'Available Models'}
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="text-sm">
                          {plan.modelsCount || 0} {locale === 'ar' ? 'نموذج AI' : 'AI models'}
                        </div>
                        {plan.featuredModels && plan.featuredModels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {plan.featuredModels.slice(0, 2).map((model: string) => (
                              <Badge key={model} variant="outline" className="text-xs px-1.5 py-0">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {locale === 'ar' ? 'المحادثات والرسائل' : 'Chats & Messages'}
                      </div>
                      <div className="pl-6 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxChats === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                {locale === 'ar' ? 'محادثات' : 'chats'}
                              </span>
                            ) : (
                              <>
                                {maxChats} {locale === 'ar' ? 'محادثة' : 'chats'}
                                {chatsIncrease > 0 && !isCurrent && (
                                  <span className="text-xs text-primary ml-1">
                                    (+{chatsIncrease}%)
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxMessages === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                {locale === 'ar' ? 'رسائل' : 'messages'}
                              </span>
                            ) : (
                              <>
                                {formatNumber(maxMessages, locale)} {locale === 'ar' ? 'رسالة/شهر' : 'messages/month'}
                                {messagesIncrease > 0 && !isCurrent && (
                                  <span className="text-xs text-primary ml-1">
                                    (+{messagesIncrease}%)
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        {locale === 'ar' ? 'الأدوات والإمكانيات' : 'Tools & Capabilities'}
                      </div>
                      <div className="pl-6 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxMCP === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                MCP Servers
                              </span>
                            ) : maxMCP === 0 ? (
                              locale === 'ar' ? 'لا يوجد MCP' : 'No MCP'
                            ) : (
                              `${maxMCP} MCP ${maxMCP === 1 ? 'Server' : 'Servers'}`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxWorkflows === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                Workflows
                              </span>
                            ) : maxWorkflows === 0 ? (
                              locale === 'ar' ? 'لا يوجد Workflows' : 'No Workflows'
                            ) : (
                              `${maxWorkflows} ${maxWorkflows === 1 ? 'Workflow' : 'Workflows'}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        {locale === 'ar' ? 'الوسائط والتخزين' : 'Media & Storage'}
                      </div>
                      <div className="pl-6 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxImages === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                {locale === 'ar' ? 'توليد صور' : 'Image generation'}
                              </span>
                            ) : maxImages === 0 ? (
                              <span className="text-muted-foreground">
                                {locale === 'ar' ? '✗ لا يوجد توليد صور' : '✗ No images'}
                              </span>
                            ) : (
                              `${maxImages} ${locale === 'ar' ? 'صورة/يوم' : 'images/day'} (${maxImagesMonth}/${locale === 'ar' ? 'شهر' : 'month'})`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <HardDrive className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {formatStorage(maxStorage, locale)} {locale === 'ar' ? 'تخزين' : 'storage'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || loading || pendingRequest !== null}
                    onClick={() => handleUpgradeClick(plan.slug)}
                  >
                    {isCurrent
                      ? (locale === 'ar' ? 'الخطة الحالية' : 'Current Plan')
                      : plan.slug === "enterprise"
                        ? (locale === 'ar' ? 'تواصل معنا' : 'Contact Us')
                        : (locale === 'ar' ? 'ترقية الآن' : 'Upgrade')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {isEnterprisePlan
                ? t("plans.enterprise")
                : `${t("upgradeTo")} ${selectedPlanDetails ? (locale === 'ar' ? (selectedPlanDetails.displayName.ar || selectedPlanDetails.displayName.en) : (selectedPlanDetails.displayName.en || selectedPlanDetails.displayName.ar)) : ""}`}
              {selectedPlanDetails &&
                selectedPlanDetails.pricing.monthly > 0 &&
                !isEnterprisePlan && (
                  <span className="mr-2 text-primary">
                    ${subscriptionType === "yearly" ? selectedPlanDetails.pricing.yearly : selectedPlanDetails.pricing.monthly}/{subscriptionType === "yearly" ? "سنة" : t("month")}
                  </span>
                )}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isEnterprisePlan
                ? "تواصل معنا للحصول على عرض مخصص يناسب احتياجات مؤسستك"
                : "اختر طريقة الدفع وأرسل الطلب"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isEnterprisePlan ? (
              <>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-center">
                      <h3 className="font-semibold text-lg">خطة الشركات</h3>
                      <p className="text-sm text-muted-foreground">
                        احصل على حلول مخصصة بالكامل لاحتياجات مؤسستك مع دعم مخصص
                        وأولوية في الخدمة
                      </p>
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>أسعار مخصصة حسب الاستخدام</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>دعم فني مخصص 24/7</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>مميزات وتخصيصات خاصة</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>SLA مضمون</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleEnterpriseContact}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  تواصل معنا عبر واتساب
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  سيقوم فريقنا بالتواصل معك لمناقشة احتياجاتك وتقديم عرض مخصص
                </p>
              </>
            ) : (
              <>
                {showDurationOptions && (
                  <div className="space-y-2">
                    <Label className="text-sm">مدة الاشتراك</Label>
                    <RadioGroup
                      value={subscriptionType}
                      onValueChange={(v) => setSubscriptionType(v as SubscriptionType)}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="monthly" id="duration-monthly" />
                        <Label
                          htmlFor="duration-monthly"
                          className="cursor-pointer font-normal"
                        >
                          شهري - ${selectedPlanDetails?.pricing.monthly}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yearly" id="duration-yearly" />
                        <Label
                          htmlFor="duration-yearly"
                          className="cursor-pointer font-normal"
                        >
                          سنوي - ${selectedPlanDetails?.pricing.yearly}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">طريقة الدفع</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label
                        htmlFor="paypal"
                        className="cursor-pointer font-normal"
                      >
                        PayPal
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label
                        htmlFor="stripe"
                        className="cursor-pointer font-normal"
                      >
                        Stripe (Card)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="bank_transfer" id="bank" />
                      <Label
                        htmlFor="bank"
                        className="cursor-pointer font-normal"
                      >
                        تحويل بنكي
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label
                        htmlFor="manual"
                        className="cursor-pointer font-normal"
                      >
                        دفع يدوي (عبر المشرف)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm leading-relaxed">
                    {paymentMethod === "paypal" || paymentMethod === "stripe" ? (
                      LEGACY_PLANS.includes(selectedPlan || "") && selectedPlan !== 'free' ? (
                        <>🌐 سيتم إرسال الطلب للمراجعة وفتح بوابة الدفع تلقائياً</>
                      ) : (
                        <>📋 سيتم إرسال الطلب للمراجعة والموافقة من المشرف</>
                      )
                    ) : paymentMethod === "bank_transfer" ? (
                      <>🏦 أدخل تفاصيل التحويل البنكي أدناه</>
                    ) : (
                      <>📋 سيتم إرسال الطلب للمشرف للتواصل معك وترتيب الدفع</>
                    )}
                  </AlertDescription>
                </Alert>

                {showBankFields && (
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        تفاصيل التحويل البنكي
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          رقم الحساب
                        </Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm font-mono break-all">
                            {bankDetails.accountNumber}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() =>
                              handleCopy(bankDetails.accountNumber, "account")
                            }
                          >
                            {copiedField === "account" ? (
                              <CheckCheck className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          دفع لصديق
                        </Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm font-mono break-all">
                            {bankDetails.friendPayNumber}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() =>
                              handleCopy(bankDetails.friendPayNumber, "friend")
                            }
                          >
                            {copiedField === "friend" ? (
                              <CheckCheck className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          محفظة ريفلكت
                        </Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm font-mono break-all">
                            {bankDetails.reflectWallet}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="shrink-0"
                            onClick={() =>
                              handleCopy(bankDetails.reflectWallet, "reflect")
                            }
                          >
                            {copiedField === "reflect" ? (
                              <CheckCheck className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">
                          {bankDetails.bankName}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showBankFields && (
                  <div className="space-y-2">
                    <Label htmlFor="transaction" className="text-sm">
                      رقم المعاملة *
                    </Label>
                    <Input
                      id="transaction"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="أدخل رقم المعاملة بعد التحويل"
                      className="text-sm"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    {showManualNotes
                      ? "ملاحظات أو طريقة دفع مفضلة"
                      : "ملاحظات"}{" "}
                    (اختياري)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      showManualNotes
                        ? "مثال: أفضل الدفع عن طريق التحويل المباشر / ريفلكت / صديق لصديق..."
                        : "معلومات إضافية..."
                    }
                    rows={showManualNotes ? 3 : 2}
                    className="text-sm resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmitRequest}
                  className="w-full gap-2"
                  size="lg"
                  disabled={!canSubmit}
                >
                  <Send className="h-5 w-5" />
                  {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>

                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  تواصل عبر واتساب (للمساعدة)
                </Button>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              {isEnterprisePlan ? "إغلاق" : "إلغاء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
