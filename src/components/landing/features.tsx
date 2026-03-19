import { getTranslations } from 'next-intl/server';
import { Bot, Code2, Search, Layers, Globe, Zap, Lock, Cpu } from 'lucide-react';

const FEATURES = [
  { key: 'agents', icon: Bot },
  { key: 'mcp', icon: Cpu },
  { key: 'code', icon: Code2 },
  { key: 'search', icon: Search },
  { key: 'multimodal', icon: Layers },
  { key: 'arabic', icon: Globe },
  { key: 'control', icon: Lock },
  { key: 'fast', icon: Zap },
];

export async function FeaturesSection() {
  const t = await getTranslations('landing.features');

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t(`items.${key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`items.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
