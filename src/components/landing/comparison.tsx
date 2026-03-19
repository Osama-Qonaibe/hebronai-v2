import { getTranslations } from 'next-intl/server';
import { Check, X, Minus } from 'lucide-react';

type Status = 'yes' | 'no' | 'partial';

const ROWS: { key: string; hebron: Status; chatgpt: Status; claude: Status }[] = [
  { key: 'models', hebron: 'yes', chatgpt: 'partial', claude: 'no' },
  { key: 'agents', hebron: 'yes', chatgpt: 'partial', claude: 'no' },
  { key: 'mcp', hebron: 'yes', chatgpt: 'no', claude: 'no' },
  { key: 'code', hebron: 'yes', chatgpt: 'partial', claude: 'partial' },
  { key: 'arabic', hebron: 'yes', chatgpt: 'partial', claude: 'partial' },
  { key: 'search', hebron: 'yes', chatgpt: 'partial', claude: 'no' },
  { key: 'price', hebron: 'yes', chatgpt: 'partial', claude: 'partial' },
  { key: 'identity', hebron: 'yes', chatgpt: 'no', claude: 'no' },
];

function StatusIcon({ status }: { status: Status }) {
  if (status === 'yes') return <Check className="size-5 text-green-500 mx-auto" />;
  if (status === 'no') return <X className="size-5 text-red-500/70 mx-auto" />;
  return <Minus className="size-5 text-yellow-500 mx-auto" />;
}

export async function ComparisonSection() {
  const t = await getTranslations('landing.comparison');

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start py-4 px-4 text-muted-foreground font-medium">{t('feature')}</th>
                <th className="text-center py-4 px-4 text-primary font-bold">
                  HebronAI
                </th>
                <th className="text-center py-4 px-4 text-muted-foreground font-medium">ChatGPT</th>
                <th className="text-center py-4 px-4 text-muted-foreground font-medium">Claude</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.key} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-background/50' : ''}`}>
                  <td className="py-4 px-4 text-sm">{t(`rows.${row.key}`)}</td>
                  <td className="py-4 px-4"><StatusIcon status={row.hebron} /></td>
                  <td className="py-4 px-4"><StatusIcon status={row.chatgpt} /></td>
                  <td className="py-4 px-4"><StatusIcon status={row.claude} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
