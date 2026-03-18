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
} from "lucide-react";
import { getPaymentLink } from "@/lib/payment/config";
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
  const [enterpriseLoading, setEnterpriseLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [notes, setNotes] = useState("");

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
          notes:
            notes ||
            `Payment method: ${getPaymentMethodLabel(paymentMethod)}`,
        }),
      });

      if (response.ok) {
        const isLegacyPlan = LEGACY_PLANS.includes(selectedPlan) && selectedPlan !== 'free';
        const shouldRedirectToGateway = isLegacyPlan && paymentMethod === "stripe";

        if (shouldRedirectToGateway) {
          const link = getPaymentLink(selectedPlan as "basic" | "pro");
          toast.success(locale === 'ar' ? "✅ تم إرسال الطلب" : "✅ Request sent", {
            description: locale === 'ar' ? "سيتم فتح بوابة الدفع الآن..." : "Payment gateway will open now...",
          });
          setTimeout(() => {
            if (link) {
              window.location.href = link;
            }
          }, 1500);
        } else {
          toast.success(locale === 'ar' ? "✅ تم إرسال الطلب" : "✅ Request sent", {
            description: locale === 'ar'
              ? "سيتم مراجعة طلبك والتواصل معك لإتمام عملية الدفع."
              : "Your request will be reviewed and we will contact you to complete the payment.",
          });
        }

        setSelectedPlan(null);
        setSubscriptionType("monthly");
        setNotes("");

        if (!shouldRedirectToGateway) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        const error = await response.json();
        toast.error(locale === 'ar' ? "خطأ" : "Error", {
          description: error.error || (locale === 'ar' ? "فشل في إرسال الطلب. حاول مرة أخرى." : "Failed to submit request. Please try again."),
        });
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error(locale === 'ar' ? "خطأ" : "Error", {
        description: locale === 'ar' ? "فشل في إرسال الطلب. حاول مرة أخرى." : "Failed to submit request. Please try again.",
      });
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
          notes: locale === 'ar'
            ? "طلب التواصل بشأن خطة Enterprise عبر واتساب"
            : "Contact request for Enterprise plan via WhatsApp",
        }),
      });
    } catch (err) {
      console.error("Enterprise request failed:", err);
    } finally {
      setEnterpriseLoading(false);
    }

    const message = encodeURIComponent(
      locale === 'ar'
        ? `مرحباً، أرغب في الاستفسار عن خطة Enterprise للشركات.\n\nأود معرفة المزيد عن المميزات والأسعار المخصصة.`
        : `Hello, I would like to inquire about the Enterprise plan.\n\nI'd like to know more about the features and custom pricing.`,
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppContact = () => {
    if (!selectedPlan) return;

    const planDetails = plans.find((p) => p.slug === selectedPlan);
    if (!planDetails) return;

    const planName = locale === 'ar'
      ? (planDetails.displayName.ar || planDetails.displayName.en)
      : (planDetails.displayName.en || planDetails.displayName.ar);
    const price = subscriptionType === "yearly" ? planDetails.pricing.yearly : planDetails.pricing.monthly;
    const period = subscriptionType === "yearly"
      ? (locale === 'ar' ? "سنة" : "year")
      : (locale === 'ar' ? "شهر" : "month");
    const message = encodeURIComponent(
      locale === 'ar'
        ? `مرحباً، أرغب في الترقية إلى خطة ${planName} ($${price}/${period}).\n\nطريقة الدفع: ${getPaymentMethodLabel(paymentMethod)}\n\nأحتاج مساعدة.`
        : `Hello, I would like to upgrade to the ${planName} plan ($${price}/${period}).\n\nPayment method: ${getPaymentMethodLabel(paymentMethod)}\n\nI need assistance.`,
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  function getPaymentMethodLabel(method: PaymentMethod): string {
    const methods: Record<PaymentMethod, string> = {
      stripe: "Stripe (Card)",
      manual: locale === 'ar' ? "دفع يدوي عبر المشرف" : "Manual payment via admin",
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
  const showManualNotes = paymentMethod === "manual" && !isEnterprisePlan;
  const canSubmit = !loading;

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
                    {plan.pricing.monthly === 0 && plan.slug !== 'enterprise' && (
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'مثالي لتجربة HebronAI' : 'Perfect for trying HebronAI'}
                      </p>
                    )}
                    {plan.pricing.monthly > 0 && plan.slug !== 'enterprise' && (
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ar'
                          ? plan.slug === 'basic' ? 'للمستخدمين المبتدئين' : 'للمحترفين والمستخدمين المتقدمين'
                          : plan.slug === 'basic' ? 'For beginners' : 'For professionals'
                        }
                      </p>
                    )}
                    {plan.slug === 'enterprise' && (
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ar' ? 'حلول متكاملة للفرق والشركات' : 'Complete solutions for teams'}
                      </p>
                    )}
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
                          {plan.modelsCount || plan.models?.count || 0} {locale === 'ar' ? 'نموذج AI' : 'AI models'}
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
                    ${subscriptionType === "yearly" ? selectedPlanDetails.pricing.yearly : selectedPlanDetails.pricing.monthly}/{subscriptionType === "yearly" ? (locale === 'ar' ? "سنة" : "year") : t("month")}
                  </span>
                )}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isEnterprisePlan
                ? (locale === 'ar' ? "تواصل معنا للحصول على عرض مخصص يناسب احتياجات مؤسستك" : "Contact us for a custom offer tailored to your organization's needs")
                : (locale === 'ar' ? "اختر طريقة الدفع وأرسل الطلب" : "Choose a payment method and submit your request")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isEnterprisePlan ? (
              <>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-center">
                      <h3 className="font-semibold text-lg">
                        {locale === 'ar' ? 'خطة الشركات' : 'Enterprise Plan'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ar'
                          ? 'احصل على حلول مخصصة بالكامل لاحتياجات مؤسستك مع دعم مخصص وأولوية في الخدمة'
                          : 'Get fully customized solutions for your organization with dedicated support and priority service'}
                      </p>
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{locale === 'ar' ? 'أسعار مخصصة حسب الاستخدام' : 'Custom pricing based on usage'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{locale === 'ar' ? 'دعم فني مخصص 24/7' : 'Dedicated technical support 24/7'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{locale === 'ar' ? 'مميزات وتخصيصات خاصة' : 'Custom features and configurations'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{locale === 'ar' ? 'SLA مضمون' : 'Guaranteed SLA'}</span>
                        </div>
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
                    ? (locale === 'ar' ? "جاري الإرسال..." : "Sending...")
                    : (locale === 'ar' ? "تواصل معنا عبر واتساب" : "Contact us via WhatsApp")}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {locale === 'ar'
                    ? 'سيقوم فريقنا بالتواصل معك لمناقشة احتياجاتك وتقديم عرض مخصص'
                    : 'Our team will contact you to discuss your needs and provide a custom offer'}
                </p>
              </>
            ) : (
              <>
                {showDurationOptions && (
                  <div className="space-y-2">
                    <Label className="text-sm">
                      {locale === 'ar' ? 'مدة الاشتراك' : 'Subscription Duration'}
                    </Label>
                    <RadioGroup
                      value={subscriptionType}
                      onValueChange={(v) => setSubscriptionType(v as SubscriptionType)}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="monthly" id="duration-monthly" />
                        <Label htmlFor="duration-monthly" className="cursor-pointer font-normal">
                          {locale === 'ar' ? 'شهري' : 'Monthly'} - ${selectedPlanDetails?.pricing.monthly}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yearly" id="duration-yearly" />
                        <Label htmlFor="duration-yearly" className="cursor-pointer font-normal">
                          {locale === 'ar' ? 'سنوي' : 'Yearly'} - ${selectedPlanDetails?.pricing.yearly}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">
                    {locale === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                  </Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="cursor-pointer font-normal">
                        Stripe (Card)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="cursor-pointer font-normal">
                        {locale === 'ar' ? 'دفع يدوي (عبر المشرف)' : 'Manual payment (via admin)'}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm leading-relaxed">
                    {paymentMethod === "stripe" ? (
                      LEGACY_PLANS.includes(selectedPlan || "") && selectedPlan !== 'free' ? (
                        locale === 'ar'
                          ? <>🌐 سيتم إرسال الطلب للمراجعة وفتح بوابة الدفع تلقائياً</>
                          : <>🌐 Request will be sent for review and payment gateway will open automatically</>
                      ) : (
                        locale === 'ar'
                          ? <>📋 سيتم إرسال الطلب للمراجعة والموافقة من المشرف</>
                          : <>📋 Request will be sent for admin review and approval</>
                      )
                    ) : (
                      locale === 'ar'
                        ? <>📋 سيتم إرسال الطلب للمشرف للتواصل معك وترتيب الدفع</>
                        : <>📋 Request will be sent to admin to contact you and arrange payment</>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    {showManualNotes
                      ? (locale === 'ar' ? 'ملاحظات أو طريقة دفع مفضلة' : 'Notes or preferred payment method')
                      : (locale === 'ar' ? 'ملاحظات' : 'Notes')}{" "}
                    ({locale === 'ar' ? 'اختياري' : 'optional'})
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      showManualNotes
                        ? (locale === 'ar' ? 'مثال: أفضل الدفع عن طريق التحويل المباشر / ريفلكت / صديق لصديق...' : 'Example: I prefer direct transfer / Reflect / friend to friend...')
                        : (locale === 'ar' ? 'معلومات إضافية...' : 'Additional information...')
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
                  {loading
                    ? (locale === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                    : (locale === 'ar' ? 'إرسال الطلب' : 'Submit Request')}
                </Button>

                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  {locale === 'ar' ? 'تواصل عبر واتساب (للمساعدة)' : 'Contact via WhatsApp (for help)'}
                </Button>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              {isEnterprisePlan
                ? (locale === 'ar' ? 'إغلاق' : 'Close')
                : (locale === 'ar' ? 'إلغاء' : 'Cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
