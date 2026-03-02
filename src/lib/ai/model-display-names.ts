export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  // OpenAI - GPT-5 Series
  'gpt-5.2-pro': 'GPT-5.2 Pro',
  'gpt-5.2': 'GPT-5.2',
  'gpt-5.2-chat': 'GPT-5.2 Chat',
  'gpt-5.2-codex': 'GPT-5.2 Code',
  'gpt-5-nano': 'GPT-5 Nano',
  'gpt-5-mini': 'GPT-5 Mini',
  'gpt-5.1': 'GPT-5.1',
  'gpt-5.1-chat': 'GPT-5.1 Chat',
  'gpt-5.1-codex': 'GPT-5.1 Code',
  'gpt-5.1-codex-mini': 'GPT-5.1 Code Mini',
  
  // OpenAI - GPT-4 Series
  'gpt-4.1': 'GPT-4.1',
  'gpt-4.1-mini': 'GPT-4.1 Mini',
  'gpt-4.1-nano': 'GPT-4.1 Nano',
  
  // OpenAI - Reasoning Models
  'o4-mini': 'o4-mini',
  'o3': 'o3',
  
  // OpenAI - Image Generation
  'gpt-image-1.5': 'Image Gen 1.5',
  'dall-e-3': 'DALL-E 3',
  
  // OpenAI - Video Generation (Sora)
  'sora-2-pro': 'Sora 2 Pro',
  'sora-2': 'Sora 2',
  
  // OpenAI - Audio Models
  'gpt-audio': 'GPT Audio',
  'whisper': 'Whisper',
  'tts-1-hd': 'TTS HD',
  'tts-1': 'TTS',
  
  // Google Gemini
  'gemini-2.5-flash-lite': 'Gemini 2.5 Lite',
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'gemini-3-pro': 'Gemini 3 Pro',
  'gemini-2.5-pro': 'Gemini 2.5 Pro',
  
  // Anthropic Claude
  'sonnet-4.5': 'Sonnet 4.5',
  'haiku-4.5': 'Haiku 4.5',
  'opus-4.5': 'Opus 4.5',
  
  // xAI Grok
  'grok-4-1-fast': 'Grok 4.1 Fast',
  'grok-4-1': 'Grok 4.1',
  'grok-3-mini': 'Grok 3 Mini',
  
  // Ollama Cloud
  'deepseek-v3.1:671b-cloud': 'DeepSeek 671B',
  'qwen3-coder:480b-cloud': 'Qwen3 Coder 480B',
  'gpt-oss:120b-cloud': 'GPT-OSS 120B',
  'gpt-oss:20b-cloud': 'GPT-OSS 20B',
  'kimi-k2:1t-cloud': 'Kimi K2 (1T)',
  'glm-4.6:cloud': 'GLM 4.6',
  'qwen3-vl:235b-cloud': 'Qwen3 VL 235B',
  
  // Groq
  'kimi-k2-instruct': 'Kimi K2',
  'llama-4-scout-17b': 'Llama 4 Scout',
  'gpt-oss-20b': 'GPT-OSS 20B',
  'gpt-oss-120b': 'GPT-OSS 120B',
  'qwen3-32b': 'Qwen3 32B',
  
  // OpenRouter
  'auto': 'Auto Router',
  'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
  'llama-3.1-405b': 'Llama 3.1 405B',
  'mixtral-8x22b': 'Mixtral 8x22B',
  'deepseek-chat-v3': 'DeepSeek Chat v3',
};

export function getModelDisplayName(fullName: string): string {
  return MODEL_DISPLAY_NAMES[fullName] || fullName;
}

export function getModelsByProvider() {
  const byProvider: Record<string, Array<{ id: string; name: string }>> = {
    openai: [],
    google: [],
    anthropic: [],
    xai: [],
    ollama: [],
    groq: [],
    openRouter: [],
  };

  Object.entries(MODEL_DISPLAY_NAMES).forEach(([id, name]) => {
    if (id.startsWith('gpt-') || id.startsWith('o') || id.startsWith('dall-e') || id.startsWith('sora') || id.startsWith('whisper') || id.startsWith('tts')) {
      byProvider.openai.push({ id, name });
    } else if (id.startsWith('gemini')) {
      byProvider.google.push({ id, name });
    } else if (id.includes('sonnet') || id.includes('haiku') || id.includes('opus')) {
      byProvider.anthropic.push({ id, name });
    } else if (id.startsWith('grok')) {
      byProvider.xai.push({ id, name });
    } else if (id.includes(':') && id.includes('cloud')) {
      byProvider.ollama.push({ id, name });
    } else if (id.includes('llama') || id.includes('kimi') || id.includes('qwen')) {
      byProvider.groq.push({ id, name });
    } else {
      byProvider.openRouter.push({ id, name });
    }
  });

  return byProvider;
}
