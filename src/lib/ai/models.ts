import "server-only";

import { createOllama } from "ollama-ai-provider-v2";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";
import { LanguageModelV2, openrouter } from "@openrouter/ai-sdk-provider";
import { createGroq } from "@ai-sdk/groq";
import { LanguageModel } from "ai";
import {
  createOpenAICompatibleModels,
  openaiCompatibleModelsSafeParse,
} from "./create-openai-compatiable";
import { ChatModel } from "app-types/chat";
import {
  DEFAULT_FILE_PART_MIME_TYPES,
  OPENAI_FILE_MIME_TYPES,
  GEMINI_FILE_MIME_TYPES,
  ANTHROPIC_FILE_MIME_TYPES,
  XAI_FILE_MIME_TYPES,
} from "./file-support";
const ollamaConfig: Parameters<typeof createOllama>[0] = {
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/api",
};

if (process.env.OLLAMA_API_KEY) {
  ollamaConfig.headers = {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  };
}

const ollama = createOllama(ollamaConfig);

const groq = createGroq({
  baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const staticModels = {
  openai: {
    "gpt-5.2-pro": openai("gpt-5.2-pro"),
    "gpt-5.2": openai("gpt-5.2"),
    "gpt-5.2-chat": openai("gpt-5.2-chat-latest"),
    "gpt-5.2-codex": openai("gpt-5.2-codex"),
    "gpt-5-nano": openai("gpt-5-nano"),
    "gpt-5-mini": openai("gpt-5-mini"),
    "gpt-5.1": openai("gpt-5.1"),
    "gpt-5.1-chat": openai("gpt-5.1-chat-latest"),
    "gpt-5.1-codex": openai("gpt-5.1-codex"),
    "gpt-5.1-codex-mini": openai("gpt-5.1-codex-mini"),
    "gpt-4.1": openai("gpt-4.1"),
    "gpt-4.1-mini": openai("gpt-4.1-mini"),
    "gpt-4.1-nano": openai("gpt-4.1-nano"),
    "o4-mini": openai("o4-mini"),
    o3: openai("o3"),
    "gpt-image-1.5": openai("gpt-image-1.5"),
    "dall-e-3": openai("dall-e-3"),
    "sora-2-pro": openai("sora-2-pro"),
    "sora-2": openai("sora-2"),
    "gpt-audio": openai("gpt-audio"),
    whisper: openai("whisper"),
    "tts-1-hd": openai("tts-1-hd"),
    "tts-1": openai("tts-1"),
  },
  google: {
    "gemini-2.5-flash-lite": google("gemini-2.5-flash-lite"),
    "gemini-2.5-flash": google("gemini-2.5-flash"),
    "gemini-3-pro": google("gemini-3-pro-preview"),
    "gemini-2.5-pro": google("gemini-2.5-pro"),
  },
  anthropic: {
    "sonnet-4.5": anthropic("claude-sonnet-4-5"),
    "haiku-4.5": anthropic("claude-haiku-4-5"),
    "opus-4.5": anthropic("claude-opus-4-5"),
  },
  xai: {
    "grok-4-1-fast": xai("grok-4-1-fast-non-reasoning"),
    "grok-4-1": xai("grok-4-1"),
    "grok-3-mini": xai("grok-3-mini"),
  },
  ollama: {
    "deepseek-v3.1:671b-cloud": ollama("deepseek-v3.1:671b-cloud"),
    "qwen3-coder:480b-cloud": ollama("qwen3-coder:480b-cloud"),
    "gpt-oss:120b-cloud": ollama("gpt-oss:120b-cloud"),
    "gpt-oss:20b-cloud": ollama("gpt-oss:20b-cloud"),
    "kimi-k2:1t-cloud": ollama("kimi-k2:1t-cloud"),
    "glm-4.6:cloud": ollama("glm-4.6:cloud"),
    "qwen3-vl:235b-cloud": ollama("qwen3-vl:235b-cloud"),
  },
  groq: {
    "kimi-k2-instruct": groq("moonshotai/kimi-k2-instruct"),
    "llama-4-scout-17b": groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    "gpt-oss-20b": groq("openai/gpt-oss-20b"),
    "gpt-oss-120b": groq("openai/gpt-oss-120b"),
    "qwen3-32b": groq("qwen/qwen3-32b"),
  },
  openRouter: {
    auto: openrouter("openrouter/auto"),
    "claude-3.5-sonnet": openrouter("anthropic/claude-3.5-sonnet"),
    "llama-3.1-405b": openrouter("meta-llama/llama-3.1-405b-instruct"),
    "mixtral-8x22b": openrouter("mistralai/mixtral-8x22b-instruct"),
    "deepseek-chat-v3": openrouter("deepseek/deepseek-chat-v3-0324:free"),
  },
};

const staticUnsupportedModels = new Set([staticModels.openai["o4-mini"]]);

const staticSupportImageInputModels = {
  ...staticModels.google,
  ...staticModels.xai,
  ...staticModels.openai,
  ...staticModels.anthropic,
};

const staticFilePartSupportByModel = new Map<
  LanguageModel,
  readonly string[]
>();

const registerFileSupport = (
  model: LanguageModel | undefined,
  mimeTypes: readonly string[] = DEFAULT_FILE_PART_MIME_TYPES,
) => {
  if (!model) return;
  staticFilePartSupportByModel.set(model, Array.from(mimeTypes));
};

registerFileSupport(staticModels.openai["gpt-5.2-pro"], OPENAI_FILE_MIME_TYPES);
registerFileSupport(staticModels.openai["gpt-5.2"], OPENAI_FILE_MIME_TYPES);
registerFileSupport(
  staticModels.openai["gpt-5.2-chat"],
  OPENAI_FILE_MIME_TYPES,
);
registerFileSupport(staticModels.openai["gpt-5-mini"], OPENAI_FILE_MIME_TYPES);
registerFileSupport(staticModels.openai["gpt-5-nano"], OPENAI_FILE_MIME_TYPES);
registerFileSupport(staticModels.openai["gpt-5.1"], OPENAI_FILE_MIME_TYPES);
registerFileSupport(
  staticModels.openai["gpt-5.1-chat"],
  OPENAI_FILE_MIME_TYPES,
);
registerFileSupport(staticModels.openai["gpt-4.1"], OPENAI_FILE_MIME_TYPES);
registerFileSupport(
  staticModels.openai["gpt-4.1-mini"],
  OPENAI_FILE_MIME_TYPES,
);
registerFileSupport(
  staticModels.openai["gpt-4.1-nano"],
  OPENAI_FILE_MIME_TYPES,
);
registerFileSupport(
  staticModels.google["gemini-2.5-flash-lite"],
  GEMINI_FILE_MIME_TYPES,
);
registerFileSupport(
  staticModels.google["gemini-2.5-flash"],
  GEMINI_FILE_MIME_TYPES,
);
registerFileSupport(
  staticModels.google["gemini-2.5-pro"],
  GEMINI_FILE_MIME_TYPES,
);
registerFileSupport(
  staticModels.anthropic["sonnet-4.5"],
  ANTHROPIC_FILE_MIME_TYPES,
);
registerFileSupport(
  staticModels.anthropic["opus-4.1"],
  ANTHROPIC_FILE_MIME_TYPES,
);
registerFileSupport(staticModels.xai["grok-4-fast"], XAI_FILE_MIME_TYPES);
registerFileSupport(staticModels.xai["grok-4"], XAI_FILE_MIME_TYPES);
registerFileSupport(staticModels.xai["grok-3"], XAI_FILE_MIME_TYPES);
registerFileSupport(staticModels.xai["grok-3-mini"], XAI_FILE_MIME_TYPES);
registerFileSupport(
  staticModels.openRouter["claude-3.5-sonnet"],
  ANTHROPIC_FILE_MIME_TYPES,
);

const openaiCompatibleProviders = openaiCompatibleModelsSafeParse(
  process.env.OPENAI_COMPATIBLE_DATA,
);

const {
  providers: openaiCompatibleModels,
  unsupportedModels: openaiCompatibleUnsupportedModels,
} = createOpenAICompatibleModels(openaiCompatibleProviders);

const allModels = { ...openaiCompatibleModels, ...staticModels };

const allUnsupportedModels = new Set([
  ...openaiCompatibleUnsupportedModels,
  ...staticUnsupportedModels,
]);

export const isToolCallUnsupportedModel = (model: LanguageModel) => {
  return allUnsupportedModels.has(model);
};

const isImageInputUnsupportedModel = (model: LanguageModelV2) => {
  return !Object.values(staticSupportImageInputModels).includes(model);
};

export const getFilePartSupportedMimeTypes = (model: LanguageModel) => {
  return staticFilePartSupportByModel.get(model) ?? [];
};

const fallbackModel = staticModels.openai["gpt-4.1"];

export const customModelProvider = {
  modelsInfo: Object.entries(allModels).map(([provider, models]) => ({
    provider,
    models: Object.entries(models).map(([name, model]) => ({
      name,
      isToolCallUnsupported: isToolCallUnsupportedModel(model),
      isImageInputUnsupported: isImageInputUnsupportedModel(model),
      supportedFileMimeTypes: [...getFilePartSupportedMimeTypes(model)],
    })),
    hasAPIKey: checkProviderAPIKey(provider as keyof typeof staticModels),
  })),
  getModel: (model?: ChatModel): LanguageModel => {
    if (!model) return fallbackModel;
    return allModels[model.provider]?.[model.model] || fallbackModel;
  },
};

function checkProviderAPIKey(provider: keyof typeof staticModels) {
  let key: string | undefined;
  switch (provider) {
    case "openai":
      key = process.env.OPENAI_API_KEY;
      break;
    case "google":
      key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      break;
    case "anthropic":
      key = process.env.ANTHROPIC_API_KEY;
      break;
    case "xai":
      key = process.env.XAI_API_KEY;
      break;
    case "groq":
      key = process.env.GROQ_API_KEY;
      break;
    case "openRouter":
      key = process.env.OPENROUTER_API_KEY;
      break;
    case "ollama":
      key = process.env.OLLAMA_API_KEY || "local";
      break;
    default:
      return true;
  }
  return !!key && key != "****";
}
