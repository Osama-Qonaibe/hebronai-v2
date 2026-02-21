import { getTranslations } from 'next-intl/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';

export default async function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();
  const lang = locale === 'ar' ? 'ar' : 'en';
  
  const content = await readFile(
    join(process.cwd(), 'docs', 'legal', `terms-${lang}.md`),
    'utf-8'
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}