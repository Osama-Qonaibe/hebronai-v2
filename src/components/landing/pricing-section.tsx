'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import type { PlanWithLimits } from '@/lib/services/plan-service';

interface PricingSectionProps {
  plans: PlanWithLimits[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  const t = useTranslations('landing.pricing');

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isPopular = plan.tags?.includes('popular');
            const monthlyPrice = plan.pricing.monthly;
            const features = [
              plan.models.allowed.length > 0 && `${plan.models.allowed.length} نموذج AI`,
              plan.limits.messages.maxPerDay > 0 && `${plan.limits.messages.maxPerDay.toLocaleString()} رسالة/يوم`,
              plan.features.agents.maxCustomAgents > 0 && `${plan.features.agents.maxCustomAgents} وكيل`,
              plan.features.mcpServers.maxServers > 0 && `${plan.features.mcpServers.maxServers} خادم MCP`,
              plan.features.advanced.codeInterpreter && t('codeInterpreter'),
              plan.features.advanced.imageGeneration && t('imageGeneration'),
            ].filter(Boolean) as string[];

            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-2xl border ${
                  isPopular
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    : 'border-border/50 bg-card'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      <Sparkles className="size-3" />
                      {t('popular')}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.displayName.ar || plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  {monthlyPrice === 0 ? (
                    <span className="text-4xl font-bold">{t('free')}</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">${monthlyPrice}</span>
                      <span className="text-muted-foreground text-sm">/شهر</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="size-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isPopular ? 'default' : 'outline'}
                  className="w-full"
                  asChild
                >
                  <Link href="/sign-up">
                    {monthlyPrice === 0 ? t('startFree') : t('subscribe')}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-center text-muted-foreground text-sm mt-8">
          {t('fullPlans')}{' '}
          <Link href="/pricing" className="text-primary hover:underline">
            {t('viewAll')}
          </Link>
        </p>
      </div>
    </section>
  );
}
