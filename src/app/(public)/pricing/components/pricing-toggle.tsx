'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function PricingToggle() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => setBillingPeriod('monthly')}
        className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all',
          billingPeriod === 'monthly'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        شهري
      </button>
      
      <button
        onClick={() => setBillingPeriod('yearly')}
        className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
          billingPeriod === 'yearly'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        سنوي
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          وفر 20%
        </Badge>
      </button>
    </div>
  );
}
