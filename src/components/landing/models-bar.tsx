import { getTranslations } from 'next-intl/server';

const MODELS = [
  { name: 'OpenAI', icon: '⬜' },
  { name: 'Anthropic', icon: '🔶' },
  { name: 'Google', icon: '🔵' },
  { name: 'DeepSeek', icon: '🐋' },
  { name: 'Qwen', icon: '🟣' },
  { name: 'xAI Grok', icon: '✖️' },
  { name: 'Meta Llama', icon: '🦙' },
  { name: 'Mistral', icon: '🌊' },
  { name: 'Cohere', icon: '⚡' },
  { name: 'Perplexity', icon: '🔍' },
];

export async function ModelsBar() {
  const t = await getTranslations('landing.models');

  return (
    <section className="py-16 border-y border-border/50 bg-muted/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground text-sm mb-8">
          {t('title')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 text-sm font-medium"
            >
              <span>{model.icon}</span>
              <span>{model.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 text-primary text-sm font-bold">
            +50 {t('moreModels')}
          </div>
        </div>
      </div>
    </section>
  );
}
