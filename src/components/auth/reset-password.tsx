"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useObjectState } from "@/hooks/use-object-state";
import { Loader, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ResetPassword() {
  const t = useTranslations("Auth.resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const token = searchParams.get("token");

  const [formData, setFormData] = useObjectState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  const handleSubmit = async () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error(t("error"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    if (formData.password.length < 8) {
      toast.error(t("passwordTooShort"));
      return;
    }

    if (!token) {
      toast.error(t("noToken"));
      return;
    }

    setLoading(true);

    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: formData.password,
          token,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success(t("success"));
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        toast.error(data?.error?.message || t("error"));
      }
    } catch (error: any) {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="w-full h-full flex flex-col p-4 md:p-8 justify-center">
        <Card className="w-full md:max-w-md bg-background border-none mx-auto shadow-none animate-in fade-in duration-1000">
          <CardHeader className="my-4">
            <div className="flex justify-center mb-4">
              <AlertCircle className="size-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-center my-1">
              {t("errorTitle")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t("invalidToken")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password">
              <Button className="w-full">{t("requestNewLink")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full h-full flex flex-col p-4 md:p-8 justify-center">
        <Card className="w-full md:max-w-md bg-background border-none mx-auto shadow-none animate-in fade-in duration-1000">
          <CardHeader className="my-4">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="size-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center my-1">
              {t("successTitle")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t("successDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">{t("goToSignIn")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 justify-center">
      <Card className="w-full md:max-w-md bg-background border-none mx-auto shadow-none animate-in fade-in duration-1000">
        <CardHeader className="my-4">
          <CardTitle className="text-2xl text-center my-1">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password">{t("newPassword")}</Label>
            <Input
              id="password"
              autoFocus
              disabled={loading}
              value={formData.password}
              onChange={(e) => setFormData({ password: e.target.value })}
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              disabled={loading}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ confirmPassword: e.target.value })
              }
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {t("passwordRequirements")}
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              t("resetButton")
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
