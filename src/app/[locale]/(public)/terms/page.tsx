import { readFile } from 'fs/promises';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import { BackButton } from '@/components/back-button';
import { useTranslations } from 'next-intl';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = useTranslations('Common');
  const lang = locale === 'ar' ? 'ar' : 'en';
  
  const content = await readFile(
    join(process.cwd(), 'docs', 'legal', `terms-${lang}.md`),
    'utf-8'
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <BackButton label={t('back')} />
      </div>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}