import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AIModelsTable, ModelSyncLogTable } from '@/lib/db/pg/schema.pg';
import { eq } from 'drizzle-orm';
import { ModelSyncRequest, ModelSyncResponse } from '@/types/ai-models';

const PROVIDER_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/models',
  anthropic: null,
  google: null,
};

interface ProviderModel {
  id: string;
  provider: string;
  displayName: { en: string; ar: string };
  description: { en: string; ar: string };
  pricing: { input: number; output: number; currency: string };
  maxTokens: number | null;
  contextWindow: number | null;
  capabilities: string[];
}

const KNOWN_MODELS: ProviderModel[] = [
  {
    id: 'gpt-4o',
    provider: 'openai',
    displayName: { en: 'GPT-4o', ar: 'GPT-4o' },
    description: { en: 'Most advanced OpenAI model', ar: 'أحدث نموذج من OpenAI' },
    pricing: { input: 0.005, output: 0.015, currency: 'USD' },
    maxTokens: 4096,
    contextWindow: 128000,
    capabilities: ['chat', 'vision', 'function_calling'],
  },
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    displayName: { en: 'GPT-4o Mini', ar: 'GPT-4o ميني' },
    description: { en: 'Fast and affordable', ar: 'سريع واقتصادي' },
    pricing: { input: 0.00015, output: 0.0006, currency: 'USD' },
    maxTokens: 16384,
    contextWindow: 128000,
    capabilities: ['chat', 'vision'],
  },
  {
    id: 'gpt-3.5-turbo',
    provider: 'openai',
    displayName: { en: 'GPT-3.5 Turbo', ar: 'GPT-3.5 تيربو' },
    description: { en: 'Fast and reliable', ar: 'سريع وموثوق' },
    pricing: { input: 0.0005, output: 0.0015, currency: 'USD' },
    maxTokens: 4096,
    contextWindow: 16385,
    capabilities: ['chat', 'function_calling'],
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    displayName: { en: 'Claude 3.5 Sonnet', ar: 'كلود 3.5 سونيت' },
    description: { en: 'Most intelligent Claude model', ar: 'أذكى نموذج كلود' },
    pricing: { input: 0.003, output: 0.015, currency: 'USD' },
    maxTokens: 8192,
    contextWindow: 200000,
    capabilities: ['chat', 'vision', 'function_calling'],
  },
  {
    id: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    displayName: { en: 'Claude 3.5 Haiku', ar: 'كلود 3.5 هايكو' },
    description: { en: 'Fastest Claude model', ar: 'أسرع نموذج كلود' },
    pricing: { input: 0.001, output: 0.005, currency: 'USD' },
    maxTokens: 8192,
    contextWindow: 200000,
    capabilities: ['chat', 'vision'],
  },
  {
    id: 'gemini-2.0-flash-exp',
    provider: 'google',
    displayName: { en: 'Gemini 2.0 Flash', ar: 'جيميني 2.0 فلاش' },
    description: { en: 'Google latest multimodal model', ar: 'أحدث نموذج متعدد الوسائط من جوجل' },
    pricing: { input: 0, output: 0, currency: 'USD' },
    maxTokens: 8192,
    contextWindow: 1000000,
    capabilities: ['chat', 'vision', 'multimodal'],
  },
];

export async function POST(req: NextRequest) {
  try {
    const body: ModelSyncRequest = await req.json();
    const providers = body.providers || ['openai', 'anthropic', 'google'];
    
    let totalSynced = 0;
    let totalAdded = 0;
    let totalUpdated = 0;
    const logs = [];

    for (const provider of providers) {
      try {
        const providerModels = KNOWN_MODELS.filter(m => m.provider === provider);
        
        for (const model of providerModels) {
          const existing = await db.query.AIModelsTable.findFirst({
            where: eq(AIModelsTable.name, model.id),
          });

          if (existing) {
            await db.update(AIModelsTable)
              .set({
                displayName: model.displayName,
                description: model.description,
                pricing: model.pricing,
                maxTokens: model.maxTokens,
                contextWindow: model.contextWindow,
                capabilities: model.capabilities,
                lastSyncedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(AIModelsTable.id, existing.id));
            totalUpdated++;
          } else {
            await db.insert(AIModelsTable).values({
              name: model.id,
              provider: model.provider,
              displayName: model.displayName,
              description: model.description,
              pricing: model.pricing,
              maxTokens: model.maxTokens,
              contextWindow: model.contextWindow,
              capabilities: model.capabilities,
              isActive: true,
              isVisible: true,
              supportsStreaming: true,
              lastSyncedAt: new Date(),
            });
            totalAdded++;
          }
          totalSynced++;
        }

        await db.insert(ModelSyncLogTable).values({
          provider,
          modelsSynced: providerModels.length,
          modelsAdded: totalAdded,
          modelsUpdated: totalUpdated,
          status: 'success',
          syncedAt: new Date(),
        });

        logs.push({
          provider,
          modelsSynced: providerModels.length,
          status: 'success',
        });
      } catch (error: any) {
        await db.insert(ModelSyncLogTable).values({
          provider,
          modelsSynced: 0,
          modelsAdded: 0,
          modelsUpdated: 0,
          status: 'failed',
          errorMessage: error.message,
          syncedAt: new Date(),
        });

        logs.push({
          provider,
          status: 'failed',
          error: error.message,
        });
      }
    }

    const response: ModelSyncResponse = {
      success: true,
      totalSynced,
      added: totalAdded,
      updated: totalUpdated,
      failed: 0,
      logs: logs as any,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
