'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PlanWithLimits } from '@/lib/db/pg/schema';

interface PricingCardProps {
  plan: PlanWithLimits;
  isCurrentPlan: boolean;
  isLoggedIn: boolean;
}

export function PricingCard({ plan, isCurrentPlan, isLoggedIn }: PricingCardProps) {
  const router = useRouter();
  const isPopular = plan.tags?.includes('popular');
  const isNew = plan.tags?.includes('new');
  const isFree = plan.price === 0;

  const handleSubscribe = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    if (isCurrentPlan) {
      router.push('/dashboard');
      return;
    }

    // Redirect to upgrade flow
    router.push(`/upgrade?plan=${plan.slug}`);
  };

  // Format features from limits
  const features = [
    plan.limits.tokensPerHour > 0 && `${plan.limits.tokensPerHour.toLocaleString()} توكن في الساعة`,
    plan.limits.maxAgents > 0 && `${plan.limits.maxAgents} وكيل`,
    plan.limits.maxWorkflows > 0 && `${plan.limits.maxWorkflows} سير عمل`,
    plan.limits.maxMCPServers > 0 && `${plan.limits.maxMCPServers} خادم MCP`,
    plan.limits.imageGenerationsPerDay > 0 && `${plan.limits.imageGenerationsPerDay} صورة/يوم`,
    plan.limits.maxFileUploads > 0 && `${plan.limits.maxFileUploads} ملف مرفق`,
    plan.limits.maxDailyMessages > 0 && `${plan.limits.maxDailyMessages} رسالة/يوم`,
  ].filter(Boolean) as string[];

  return (
    <Card 
      className={`relative transition-all hover:shadow-lg ${
        isPopular ? 'border-primary/50 ring-2 ring-primary/20' : ''
      }`}
    >
      {/* Tags/Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isPopular && (
          <Badge variant="default" className="gap-1">
            <Sparkles className="size-3" />
            الأكثر شعبية
          </Badge>
        )}
        {isNew && (
          <Badge variant="secondary">
            جديد
          </Badge>
        )}
        {isCurrentPlan && (
          <Badge variant="outline" className="border-primary text-primary">
            خطتك الحالية
          </Badge>
        )}
      </div>

      <CardHeader className="pt-12">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        {plan.description && (
          <CardDescription className="text-base">
            {plan.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          {isFree ? (
            <span className="text-4xl font-bold">مجاني</span>
          ) : (
            <>
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/شهر</span>
            </>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          variant={isPopular ? 'default' : 'outline'}
          className="w-full"
          size="lg"
        >
          {isCurrentPlan
            ? 'إدارة الخطة'
            : isFree
            ? 'ابدأ مجاناً'
            : 'اشترك الآن'
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
