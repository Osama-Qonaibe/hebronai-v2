"use client";

import { useEffect, useState } from "react";
import { Button } from "ui/button";
import { Card } from "ui/card";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode =
      ("standalone" in window.navigator &&
        (window.navigator as any).standalone) ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsIOS(isIOSDevice);
    setIsStandalone(isInStandaloneMode);

    if (isInStandaloneMode) {
      return;
    }

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < dayInMs * 7) {
        return;
      }
    }

    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 3000);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt && !isIOS) return;

    if (isIOS) {
      toast.info("📱 تثبيت التطبيق", {
        description:
          'اضغط على زر "مشاركة" ثم اختر "إضافة إلى الشاشة الرئيسية"',
        duration: 8000,
      });
      setShowPrompt(false);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        toast.success("✅ تم تثبيت التطبيق بنجاح!");
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <Card className="border-2 border-primary/50 bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">
              ثبّت تطبيق HebronAI
            </h3>
            <p className="text-xs text-muted-foreground">
              {isIOS
                ? "لتجربة أفضل، أضف التطبيق للشاشة الرئيسية"
                : "استخدم التطبيق كأنه تطبيق أصلي على جهازك"}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleInstall}
              size="sm"
              className="gap-2 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              تثبيت
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
