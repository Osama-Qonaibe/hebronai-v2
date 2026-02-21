"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "ui/button";

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function BackButton({
  href,
  label,
  variant = "ghost",
  size = "default",
  className = "",
}: BackButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const Icon = isRTL ? ArrowRight : ArrowLeft;

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`group ${className}`}
    >
      <Icon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );
}
