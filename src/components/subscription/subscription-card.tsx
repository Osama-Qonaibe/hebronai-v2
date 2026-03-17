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
  MessageCircle,
  Send,
  Loader2,
  Bot,
  MessageSquare,
  Zap,
  Image as ImageIcon,
  HardDrive,
  Infinity,
  CreditCard,
} from "lucide-react";
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
import { Textarea } from "ui/textarea";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { usePlans } from "@/hooks/use-plans";
import { Separator } from "ui/separator";

type SubscriptionStatus = "active" | "expired" | "cancelled" | "trial";
type PaymentMethod = "stripe" | "manual";
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
  if (num === -1) return locale === "ar" ? "غير محدود" : "Unlimited";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}

function formatStorage(gb: number, locale: string): string {
  if (gb === -1) return locale === "ar" ? "غير محدود" : "Unlimited";
  if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
  if (gb > 100) return `100+ GB`;
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
  const [stripeLoading, setStripeLoading] = useState(false);
  const [enterpriseLoading, setEnterpriseLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [notes, setNotes] = useState("");

  const WHATSAPP_NUMBER = "+972534414330";
  const isAr = locale === "ar";

  const handleUpgradeClick = (planSlug: string) => {
    if (planSlug === currentPlan) return;
    if (pendingRequest) {
      toast.error(t("pendingRequestAlert", { plan: pendingRequest.requestedPlan }));
      return;
    }
    setSelectedPlan(planSlug);
    setSubscriptionType("monthly");
    setPaymentMethod("stripe");
    setNotes("");
  };

  const handleStripeCheckout = async () => {
    if (!selectedPlan) return;
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, subscriptionType }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(isAr ? "فشل في فتح بوابة الدفع" : "Failed to open payment gateway");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error(isAr ? "خطأ في الاتصال" : "Connection error");
    } finally {
      setStripeLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const planDetails = plans.find((p) => p.slug === selectedPlan);
      if (!planDetails) throw new Error("Invalid plan");

      const amount =
        subscriptionType === "yearly"
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
          notes: notes || `Payment method: ${paymentMethod}`,
        }),
      });

      if (response.ok) {
        toast.success(isAr ? "✅ تم إرسال الطلب" : "✅ Request Submitted", {
          description: isAr
            ? "سيتم مراجعة طلبك والتواصل معك لإتمام الدفع."
            : "Your request will be reviewed and you will be contacted.",
        });
        setSelectedPlan(null);
        setNotes("");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        const error = await response.json();
        toast.error(isAr ? "خطأ" : "Error", {
          description: error.error || (isAr ? "فشل في إرسال الطلب" : "Failed to submit request"),
        });
      }
    } catch {
      toast.error(isAr ? "فشل في إرسال الطلب" : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseContact = async () => {
    setEnterpriseLoading(true);
    try {
      await fetch("/api/user/subscription-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlan: "enterprise",
          subscriptionType: "monthly",
          paymentMethod: "manual",
          amount: 0,
          currency: "USD",
          notes: "Enterprise contact via WhatsApp",
        }),
      });
    } catch {}
    setEnterpriseLoading(false);
    const message = encodeURIComponent(
      isAr
        ? "مرحباً، أرغب في الاستفسار عن خطة Enterprise للشركات.\n\nأود معرفة المزيد عن المميزات والأسعار المخصصة."
        : "Hello, I'm interested in the Enterprise plan. I'd like to know more about features and pricing."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
  };

  const handleWhatsAppContact = () => {
    if (!selectedPlan) return;
    const planDetails = plans.find((p) => p.slug === selectedPlan);
    if (!planDetails) return;
    const planName = isAr
      ? planDetails.displayName.ar || planDetails.displayName.en
      : planDetails.displayName.en || planDetails.displayName.ar;
    const price =
      subscriptionType === "yearly"
        ? planDetails.pricing.yearly
        : planDetails.pricing.monthly;
    const period = subscriptionType === "yearly" ? (isAr ? "سنة" : "year") : (isAr ? "شهر" : "month");
    const message = encodeURIComponent(
      isAr
        ? `مرحباً، أرغب في الترقية إلى خطة ${planName} ($${price}/${period}).\n\nأحتاج مساعدة.`
        : `Hello, I'd like to upgrade to the ${planName} plan ($${price}/${period}). I need help.`
    );
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
  };

  const activePlans = plans.filter(
    (p) => p.adminSettings.isActive && p.adminSettings.isVisible
  );
  const selectedPlanDetails = plans.find((p) => p.slug === selectedPlan);
  const isEnterprisePlan = selectedPlan === "enterprise";
  const isCustomPlan = selectedPlan && !LEGACY_PLANS.includes(selectedPlan);
  const hasYearlyPrice =
    selectedPlanDetails?.pricing.yearly && selectedPlanDetails.pricing.yearly > 0;
  const showDurationOptions = isCustomPlan && hasYearlyPrice && !isEnterprisePlan;
  const showManualNotes = paymentMethod === "manual" && !isEnterprisePlan;
  const freePlan = activePlans.find((p) => p.slug === "free");

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  {" "}- {t("expires")} {formatDate(expiresAt)}
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
            const displayName = isAr
              ? plan.displayName.ar || plan.displayName.en
              : plan.displayName.en || plan.displayName.ar;
            const priceDisplay =
              plan.pricing.monthly === 0
                ? "$0"
                : plan.pricing.monthly > 0
                  ? `$${plan.pricing.monthly}`
                  : isAr ? "مخصص" : "Custom";

            const maxChats = plan.limits.chats?.maxActive || 0;
            const maxMessages = plan.limits.messages?.maxPerMonth || 0;
            const maxMCP = plan.features.mcpServers?.maxServers || 0;
            const maxWorkflows = plan.features.workflows?.maxWorkflows || 0;
            const maxImages = plan.limits.images?.maxPerDay || 0;
            const maxImagesMonth = plan.limits.images?.maxPerMonth || 0;
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
                      {isAr ? "الأكثر شعبية" : "Most Popular"}
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
                          /{isAr ? "شهر" : "month"}
                        </span>
                      )}
                    </div>
                    {plan.pricing.monthly === 0 && plan.slug !== "enterprise" && (
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "مثالي لتجربة HebronAI" : "Perfect for trying HebronAI"}
                      </p>
                    )}
                    {plan.pricing.monthly > 0 && plan.slug !== "enterprise" && (
                      <p className="text-xs text-muted-foreground">
                        {isAr
                          ? plan.slug === "basic" ? "للمستخدمين المبتدئين" : "للمحترفين والمستخدمين المتقدمين"
                          : plan.slug === "basic" ? "For beginners" : "For professionals"}
                      </p>
                    )}
                    {plan.slug === "enterprise" && (
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "حلول متكاملة للفرق والشركات" : "Complete solutions for teams"}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Bot className="h-4 w-4" />
                        {isAr ? "النماذج المتاحة" : "Available Models"}
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="text-sm">
                          {plan.modelsCount || plan.models?.count || 0}{" "}
                          {isAr ? "نموذج AI" : "AI models"}
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
                        {isAr ? "المحادثات والرسائل" : "Chats & Messages"}
                      </div>
                      <div className="pl-6 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxChats === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                {isAr ? "محادثات" : "chats"}
                              </span>
                            ) : (
                              <>
                                {maxChats} {isAr ? "محادثة" : "chats"}
                                {chatsIncrease > 0 && !isCurrent && (
                                  <span className="text-xs text-primary ml-1">(+{chatsIncrease}%)</span>
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
                                {isAr ? "رسائل" : "messages"}
                              </span>
                            ) : (
                              <>
                                {formatNumber(maxMessages, locale)}{" "}
                                {isAr ? "رسالة/شهر" : "messages/month"}
                                {messagesIncrease > 0 && !isCurrent && (
                                  <span className="text-xs text-primary ml-1">(+{messagesIncrease}%)</span>
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
                        {isAr ? "الأدوات والإمكانيات" : "Tools & Capabilities"}
                      </div>
                      <div className="pl-6 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxMCP === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" /> MCP Servers
                              </span>
                            ) : maxMCP === 0 ? (
                              isAr ? "لا يوجد MCP" : "No MCP"
                            ) : (
                              `${maxMCP} MCP ${maxMCP === 1 ? "Server" : "Servers"}`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxWorkflows === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" /> Workflows
                              </span>
                            ) : maxWorkflows === 0 ? (
                              isAr ? "لا يوجد Workflows" : "No Workflows"
                            ) : (
                              `${maxWorkflows} ${maxWorkflows === 1 ? "Workflow" : "Workflows"}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        {isAr ? "الوسائط والتخزين" : "Media & Storage"}
                      </div>
                      <div className="pl-6 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {maxImages === -1 ? (
                              <span className="flex items-center gap-1">
                                <Infinity className="h-3.5 w-3.5" />
                                {isAr ? "توليد صور" : "Image generation"}
                              </span>
                            ) : maxImages === 0 ? (
                              <span className="text-muted-foreground">
                                {isAr ? "✗ لا يوجد توليد صور" : "✗ No images"}
                              </span>
                            ) : (
                              `${maxImages} ${isAr ? "صورة/يوم" : "images/day"} (${maxImagesMonth}/${
                                isAr ? "شهر" : "month"
                              })`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <HardDrive className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {formatStorage(maxStorage, locale)}{" "}
                            {isAr ? "تخزين" : "storage"}
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
                      ? (isAr ? "الخطة الحالية" : "Current Plan")
                      : plan.slug === "enterprise"
                        ? (isAr ? "تواصل معنا" : "Contact Us")
                        : (isAr ? "ترقية الآن" : "Upgrade")}
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
                : `${t("upgradeTo")} ${
                    selectedPlanDetails
                      ? isAr
                        ? selectedPlanDetails.displayName.ar || selectedPlanDetails.displayName.en
                        : selectedPlanDetails.displayName.en || selectedPlanDetails.displayName.ar
                      : ""
                  }`}
              {selectedPlanDetails &&
                selectedPlanDetails.pricing.monthly > 0 &&
                !isEnterprisePlan && (
                  <span className="mr-2 text-primary">
                    ${
                      subscriptionType === "yearly"
                        ? selectedPlanDetails.pricing.yearly
                        : selectedPlanDetails.pricing.monthly
                    }/{subscriptionType === "yearly" ? (isAr ? "سنة" : "year") : t("month")}
                  </span>
                )}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isEnterprisePlan
                ? (isAr ? "تواصل معنا للحصول على عرض مخصص يناسب احتياجات مؤسستك" : "Contact us for a custom offer tailored to your organization")
                : (isAr ? "اختر طريقة الدفع" : "Choose your payment method")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isEnterprisePlan ? (
              <>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-center">
                      <h3 className="font-semibold text-lg">{isAr ? "خطة الشركات" : "Enterprise Plan"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isAr
                          ? "احصل على حلول مخصصة بالكامل لاحتياجات مؤسستك مع دعم مخصص وأولوية في الخدمة"
                          : "Get fully custom solutions with dedicated support and priority service"}
                      </p>
                      <div className="pt-2 space-y-2">
                        {[
                          isAr ? "أسعار مخصصة حسب الاستخدام" : "Custom pricing per usage",
                          isAr ? "دعم فني مخصص 24/7" : "Dedicated 24/7 support",
                          isAr ? "مميزات وتخصيصات خاصة" : "Custom features",
                          "SLA",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button
                  onClick={handleEnterpriseContact}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={enterpriseLoading}
                >
                  {enterpriseLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                  {enterpriseLoading
                    ? (isAr ? "جاري الإرسال..." : "Sending...")
                    : (isAr ? "تواصل معنا عبر واتساب" : "Contact us via WhatsApp")}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {isAr
                    ? "سيقوم فريقنا بالتواصل معك لمناقشة احتياجاتك وتقديم عرض مخصص"
                    : "Our team will contact you to discuss your needs and provide a custom offer"}
                </p>
              </>
            ) : (
              <>
                {showDurationOptions && (
                  <div className="space-y-2">
                    <Label className="text-sm">{isAr ? "مدة الاشتراك" : "Billing Period"}</Label>
                    <RadioGroup
                      value={subscriptionType}
                      onValueChange={(v) => setSubscriptionType(v as SubscriptionType)}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="monthly" id="duration-monthly" />
                        <Label htmlFor="duration-monthly" className="cursor-pointer font-normal">
                          {isAr ? "شهري" : "Monthly"} - ${selectedPlanDetails?.pricing.monthly}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yearly" id="duration-yearly" />
                        <Label htmlFor="duration-yearly" className="cursor-pointer font-normal">
                          {isAr ? "سنوي" : "Yearly"} - ${selectedPlanDetails?.pricing.yearly}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">{isAr ? "طريقة الدفع" : "Payment Method"}</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="cursor-pointer font-normal">
                        💳 {isAr ? "بطاقة ائتمان (Stripe)" : "Credit Card (Stripe)"}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="cursor-pointer font-normal">
                        👤 {isAr ? "دفع يدوي (عبر المشرف)" : "Manual (via Admin)"}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                  <AlertDescription className="text-sm leading-relaxed">
                    {paymentMethod === "stripe" ? (
                      isAr
                        ? "🔒 ستُحوَّل إلى صفحة دفع آمنة عبر Stripe. يتم التفعيل تلقائياً فور الدفع."
                        : "🔒 You will be redirected to a secure Stripe checkout. Activated instantly after payment."
                    ) : (
                      isAr
                        ? "📋 سيتم إرسال الطلب للمشرف للتواصل معك وترتيب الدفع"
                        : "📋 Your request will be sent to admin for manual processing"
                    )}
                  </AlertDescription>
                </Alert>

                {paymentMethod === "stripe" && (
                  <Button
                    onClick={handleStripeCheckout}
                    className="w-full gap-2"
                    size="lg"
                    disabled={stripeLoading}
                  >
                    {stripeLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CreditCard className="h-5 w-5" />
                    )}
                    {stripeLoading
                      ? (isAr ? "جاري التحويل..." : "Redirecting...")
                      : (isAr ? "ادفع الآن" : "Pay Now")}
                  </Button>
                )}

                {showManualNotes && (
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">
                      {isAr ? "ملاحظات أو طريقة دفع مفضلة" : "Notes or preferred payment method"}{" "}
                      ({isAr ? "اختياري" : "Optional"})
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isAr ? "مثال: أفضل الدفع عن طريق التحويل المباشر / ريفلكت / صديق لصديق..." : "e.g. I prefer bank transfer / Reflect..."}
                      rows={3}
                      className="text-sm resize-none"
                    />
                  </div>
                )}

                {paymentMethod === "manual" && (
                  <Button
                    onClick={handleSubmitRequest}
                    className="w-full gap-2"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    {loading
                      ? (isAr ? "جاري الإرسال..." : "Sending...")
                      : (isAr ? "إرسال الطلب" : "Submit Request")}
                  </Button>
                )}

                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isAr ? "تواصل عبر واتساب (للمساعدة)" : "Contact via WhatsApp (Help)"}
                </Button>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              {isEnterprisePlan ? (isAr ? "إغلاق" : "Close") : (isAr ? "إلغاء" : "Cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
