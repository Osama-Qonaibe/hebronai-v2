import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const SOCIAL_LINKS = [
  { label: 'X (Twitter)', href: 'https://x.com/hebronai' },
  { label: 'Instagram', href: 'https://instagram.com/hebronai' },
  { label: 'Telegram', href: 'https://t.me/hebronai' },
];

export async function LandingFooter() {
  const t = await getTranslations('landing.footer');

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <p className="text-xl font-bold text-primary mb-3">HebronAI</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('tagline')}
            </p>
          </div>
          <div>
            <p className="font-medium mb-3">{t('product')}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">{t('features')}</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">{t('pricing')}</Link></li>
              <li><Link href="/sign-up" className="hover:text-foreground transition-colors">{t('signUp')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-3">{t('social')}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HebronAI. {t('rights')}</p>
          <p className="flex items-center gap-1">
            {t('madeIn')} 🇵🇸
          </p>
        </div>
      </div>
    </footer>
  );
}
