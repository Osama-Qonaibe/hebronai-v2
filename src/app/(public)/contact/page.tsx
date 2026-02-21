import { getTranslations } from 'next-intl/server';
import { Mail, Facebook, Instagram } from 'lucide-react';

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="mailto:support@hebronai.info"
            className="flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-sm text-muted-foreground">
                support@hebronai.info
              </p>
            </div>
          </a>

          <a
            href="https://facebook.com/virallinkup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <Facebook className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Facebook</h3>
              <p className="text-sm text-muted-foreground">
                @virallinkup
              </p>
            </div>
          </a>

          <a
            href="https://instagram.com/virallinkup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <Instagram className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Instagram</h3>
              <p className="text-sm text-muted-foreground">
                @virallinkup
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}