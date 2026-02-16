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
  ExternalLink,
  Copy,
  CheckCheck,
  MessageCircle,
  Send,
} from "lucide-react";
import { PLANS, type SubscriptionPlan } from "@/lib/subscription/plans";
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
import { useTranslations } from "next-intl";

type SubscriptionStatus = "active" | "expired" | "cancelled" | "trial";
type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

interface SubscriptionCardProps {
  currentPlan: SubscriptionPlan;
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

export function SubscriptionCard({
  currentPlan,
  currentStatus,
  expiresAt,
  isActive,
  pendingRequest,
}: SubscriptionCardProps) {
  const t = useTranslations("Subscription");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");

  const bankDetails = getBankTransferDetails();
  const WHATSAPP_NUMBER = "+972534414330";

  const handleUpgradeClick = (plan: SubscriptionPlan) => {
    if (plan === currentPlan) return;

    // Prevent upgrade if there's a pending request
    if (pendingRequest) {
      alert(t("pendingRequestAlert", { plan: pendingRequest.requestedPlan }));
      return;
    }

    setSelectedPlan(plan);
    setTransactionId("");
    setNotes("");
  };

  const handlePayNowAndSubmit = async () => {
    if (
      !selectedPlan ||
      selectedPlan === "free" ||
      selectedPlan === "enterprise"
    )
      return;

    const link = getPaymentLink(
      paymentMethod as "paypal" | "stripe",
      selectedPlan as "basic" | "pro",
    );

    if (link) {
      window.open(link, "_blank");
    }

    setLoading(true);
    try {
      if (!PLANS || !selectedPlan) {
        throw new Error("Invalid plan selection");
      }
      const planDetails = PLANS[selectedPlan];

      const response = await fetch("/api/user/subscription-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlan: selectedPlan,
          paymentMethod,
          amount: planDetails.price,
          currency: "USD",
          notes: `Payment initiated via ${paymentMethod}`,
        }),
      });

      if (response.ok) {
        alert("✅ تم إرسال الطلب للمراجعة! أكمل الدفع في النافذة المفتوحة.");
        setSelectedPlan(null);
        setTransactionId("");
        setNotes("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await response.json();
        alert(error.error || "فشل في إرسال الطلب. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("فشل في إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan) return;

    if (paymentMethod === "bank_transfer" && !transactionId) {
      alert("يجب إدخال رقم المعاملة بعد التحويل");
      return;
    }

    setLoading(true);
    try {
      if (!PLANS || !selectedPlan) {
        throw new Error("Invalid plan selection");
      }
      const planDetails = PLANS[selectedPlan];

      const response = await fetch("/api/user/subscription-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedPlan: selectedPlan,
          paymentMethod,
          amount: planDetails.price,
          currency: "USD",
          transactionId: transactionId || undefined,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        alert("تم إرسال طلب الاشتراك بنجاح! سيتم مراجعته قريباً.");
        setSelectedPlan(null);
        setTransactionId("");
        setNotes("");
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || "فشل في إرسال الطلب. حاول مرة أخرى.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("فشل في إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseContact = () => {
    const message = encodeURIComponent(
      `مرحباً، أرغب في الاستفسار عن خطة Enterprise للشركات.\n\nأود معرفة المزيد عن المميزات والأسعار المخصصة.`,
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsAppContact = () => {
    if (!selectedPlan || !PLANS) return;

    const planDetails = PLANS[selectedPlan];
    const message = encodeURIComponent(
      `مرحباً، أرغب في الترقية إلى خطة ${planDetails.displayName} (${planDetails.priceDisplay}/شهر).\n\nطريقة الدفع: ${getPaymentMethodArabic(paymentMethod)}\n\nأحتاج مساعدة.`,
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  function getPaymentMethodArabic(method: PaymentMethod): string {
    const methods = {
      paypal: "PayPal",
      stripe: "Stripe",
      bank_transfer: "تحويل بنكي",
    };
    return methods[method] || method;
  }

  const plans = PLANS ? Object.values(PLANS) : [];
  const selectedPlanDetails =
    selectedPlan && PLANS ? PLANS[selectedPlan] : null;
  const isEnterprisePlan = selectedPlan === "enterprise";
  const showPayButton =
    selectedPlan &&
    (selectedPlan === "basic" || selectedPlan === "pro") &&
    (paymentMethod === "paypal" || paymentMethod === "stripe");
  const showBankDetails =
    paymentMethod === "bank_transfer" && !isEnterprisePlan;

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlan;

            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      {t("popular")}
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{t(`plans.${plan.name}`)}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.priceDisplay === "Custom"
                      ? t("custom")
                      : plan.priceDisplay}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{t(plan.period)}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {plan.limits.maxAgents === -1
                          ? t("unlimited")
                          : plan.limits.maxAgents}{" "}
                        {t("agents")}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {plan.limits.maxWorkflows === -1
                          ? t("unlimited")
                          : plan.limits.maxWorkflows}{" "}
                        {t("workflows")}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {plan.limits.maxMCPServers === -1
                          ? t("unlimited")
                          : plan.limits.maxMCPServers}{" "}
                        {t("mcpServers")}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {plan.limits.maxTokensPerMonth === -1
                          ? t("unlimited")
                          : `${(plan.limits.maxTokensPerMonth / 1000).toFixed(0)}K`}{" "}
                        {t("tokensPerMonth")}
                      </span>
                    </li>
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || loading || pendingRequest !== null}
                    onClick={() => handleUpgradeClick(plan.name)}
                  >
                    {isCurrent
                      ? t("currentPlan")
                      : plan.name === "enterprise"
                        ? t("contactUs")
                        : t("upgrade")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEnterprisePlan
                ? t("plans.enterprise")
                : `${t("upgradeTo")} ${selectedPlan ? t(`plans.${selectedPlan}`) : ""}`}
              {selectedPlanDetails &&
                selectedPlanDetails.price > 0 &&
                !isEnterprisePlan && (
                  <span className="ml-2 text-primary">
                    ${selectedPlanDetails.price}/{t(selectedPlanDetails.period)}
                  </span>
                )}
            </DialogTitle>
            <DialogDescription>
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
                <div className="space-y-2">
                  <Label>طريقة الدفع</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe">Stripe (Card)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank" />
                      <Label htmlFor="bank">تحويل بنكي</Label>
                    </div>
                  </RadioGroup>
                </div>

                {showPayButton && (
                  <>
                    <Button
                      onClick={handlePayNowAndSubmit}
                      className="w-full gap-2"
                      size="lg"
                      disabled={loading}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {loading
                        ? "جاري الإرسال..."
                        : `Pay ${selectedPlanDetails?.priceDisplay} & Submit Request`}
                    </Button>
                    <Alert>
                      <AlertDescription>
                        ✅ سيتم فتح بوابة الدفع وإرسال الطلب للمراجعة تلقائياً
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                {showBankDetails && (
                  <>
                    <Card className="bg-muted/50">
                      <CardHeader>
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
                            <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono">
                              {bankDetails.accountNumber}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
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
                            <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono">
                              {bankDetails.friendPayNumber}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleCopy(
                                  bankDetails.friendPayNumber,
                                  "friend",
                                )
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
                            <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono">
                              {bankDetails.reflectWallet}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
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

                    <div className="space-y-2">
                      <Label htmlFor="transaction">رقم المعاملة *</Label>
                      <Input
                        id="transaction"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="أدخل رقم المعاملة"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="معلومات إضافية..."
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={handleSubmitRequest}
                      className="w-full gap-2"
                      size="lg"
                      disabled={loading || !transactionId}
                    >
                      <Send className="h-5 w-5" />
                      {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                  </>
                )}

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
