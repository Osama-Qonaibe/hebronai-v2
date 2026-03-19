'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LandingNavbar() {
  const t = useTranslations('landing.nav');

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          HebronAI
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('features')}
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('pricing')}
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('about')}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">{t('signIn')}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">{t('startFree')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
