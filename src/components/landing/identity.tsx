import { getTranslations } from 'next-intl/server';

export async function IdentitySection() {
  const t = await getTranslations('landing.identity');

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 text-center">
        <div className="text-6xl mb-6">🇵🇸</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('title')}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          {t('description')}
        </p>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('mission')}
        </p>
      </div>
    </section>
  );
}
