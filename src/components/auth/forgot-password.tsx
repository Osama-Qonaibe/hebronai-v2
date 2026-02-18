"use client";

import { useState } from "react";
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
import { Loader, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ForgotPassword() {
  console.log("[ForgotPassword] Component loaded");
  
  const t = useTranslations("Auth.forgotPassword");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    console.log("[ForgotPassword] Button clicked, email:", email);
    
    if (!email) {
      toast.error(t("error"));
      return;
    }

    setLoading(true);
    console.log("[ForgotPassword] Sending request...");

    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      console.log("[ForgotPassword] Response status:", response.status);

      if (response.ok) {
        setSent(true);
        toast.success(t("success"));
      } else {
        const data = await response.json().catch(() => ({}));
        console.error("[ForgotPassword] Error response:", data);
        toast.error(data?.error?.message || data?.message || t("error"));
      }
    } catch (error: any) {
      console.error("[ForgotPassword] Exception:", error);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  console.log("[ForgotPassword] Rendering, sent=", sent);

  if (sent) {
    return (
      <div className="w-full h-full flex flex-col p-4 md:p-8 justify-center">
        <Card className="w-full md:max-w-md bg-background border-none mx-auto shadow-none animate-in fade-in duration-1000">
          <CardHeader className="my-4">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="size-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center my-1">
              {t("checkEmail")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t("checkEmailDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="size-4 mr-2" />
                {t("backToSignIn")}
              </Button>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoFocus
              disabled={loading}
              value={email}
              onChange={(e) => {
                console.log("[ForgotPassword] Email changed:", e.target.value);
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="user@example.com"
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("[ForgotPassword] Enter pressed");
                  handleSubmit();
                }
              }}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => {
              console.log("[ForgotPassword] Button onClick triggered");
              handleSubmit();
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              t("sendResetLink")
            )}
          </Button>
          <Link href="/sign-in">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="size-4 mr-2" />
              {t("backToSignIn")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
