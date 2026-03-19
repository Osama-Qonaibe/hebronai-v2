import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/server';
import { LandingNavbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero';
import { ModelsBar } from '@/components/landing/models-bar';
import { FeaturesSection } from '@/components/landing/features';
import { ComparisonSection } from '@/components/landing/comparison';
import { PricingSection } from '@/components/landing/pricing-section';
import { IdentitySection } from '@/components/landing/identity';
import { LandingFooter } from '@/components/landing/footer';
import { getActivePlans } from '@/lib/services/plan-service';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect('/chat');

  const plans = await getActivePlans();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <HeroSection />
      <ModelsBar />
      <FeaturesSection />
      <ComparisonSection />
      <PricingSection plans={plans} />
      <IdentitySection />
      <LandingFooter />
    </main>
  );
}
