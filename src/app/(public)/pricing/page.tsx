import { getActivePlans } from '@/lib/services/plan-service';
import { auth } from '@/lib/auth/config';
import { getUserPlan } from '@/lib/services/plan-service';
import { PricingCard } from './components/pricing-card';
import { PricingToggle } from './components/pricing-toggle';

export const metadata = {
  title: 'التسعير - HebronAI',
  description: 'اختر الخطة المناسبة لاحتياجاتك',
};

export default async function PricingPage() {
  const session = await auth();
  const plans = await getActivePlans();
  
  let currentPlan = null;
  if (session?.user?.id) {
    currentPlan = await getUserPlan(session.user.id);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            خطط تسعير بسيطة وشفافة
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            اختر الخطة التي تناسب احتياجاتك. يمكنك الترقية أو التخفيض في أي وقت
          </p>
        </div>

        {/* Pricing Toggle (Monthly/Yearly) */}
        <PricingToggle />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlan?.slug === plan.slug}
              isLoggedIn={!!session}
            />
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            هل لديك أسئلة؟{' '}
            <a href="/contact" className="text-primary hover:underline">
              اتصل بنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
