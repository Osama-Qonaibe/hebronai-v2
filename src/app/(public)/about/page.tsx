import { readFile } from 'fs/promises';
import { join } from 'path';
import ReactMarkdown from 'react-markdown';
import { BackButton } from '@/components/back-button';

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const lang = locale === 'ar' ? 'ar' : 'en';
  
  const content = await readFile(
    join(process.cwd(), 'docs', 'legal', `about-${lang}.md`),
    'utf-8'
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <BackButton href={`/${locale}`} />
      </div>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}