import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export async function HeroSection() {
  const t = await getTranslations('landing.hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8">
          <Sparkles className="size-4" />
          <span>{t('badge')}</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {t('title')}
          <span className="block text-primary">{t('titleHighlight')}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link href="/sign-up">
              {t('ctaPrimary')}
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link href="/sign-in">{t('ctaSecondary')}</Link>
          </Button>
        </div>

        <div className="relative mx-auto max-w-5xl rounded-2xl border border-border/50 bg-card/50 backdrop-blur overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
            <div className="size-3 rounded-full bg-red-500/70" />
            <div className="size-3 rounded-full bg-yellow-500/70" />
            <div className="size-3 rounded-full bg-green-500/70" />
            <span className="ms-2 text-xs text-muted-foreground">hebronai.net/chat</span>
          </div>
          <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              {t('screenshotPlaceholder')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
