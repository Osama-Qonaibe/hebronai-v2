"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const locale = useLocale();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {isAr ? "تم الدفع بنجاح! 🎉" : "Payment Successful! 🎉"}
          </h1>
          <p className="text-muted-foreground">
            {isAr
              ? "تم تفعيل اشتراكك تلقائياً. يمكنك الآن الاستمتاع بجميع المميزات."
              : "Your subscription has been activated automatically. Enjoy all features."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {isAr
              ? `جاري التحويل إلى الدردشة خلال ${countdown} ثوانٍ...`
              : `Redirecting to chat in ${countdown} seconds...`}
          </span>
        </div>
      </div>
    </div>
  );
}
