import { appStore } from "@/app/store";
import { fetcher } from "lib/utils";
import useSWR, { SWRConfiguration } from "swr";

type ModelProvider = {
  provider: string;
  hasAPIKey: boolean;
  models: {
    name: string;
    isToolCallUnsupported: boolean;
    isImageInputUnsupported: boolean;
    supportedFileMimeTypes: string[];
  }[];
};

export const useChatModels = (options?: SWRConfiguration) => {
  return useSWR<ModelProvider[]>(
    "/api/chat/models",
    async (url: string) => {
      const response = await fetcher(url);
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === 'object' && 'models' in response) {
        return response.models;
      }
      return [];
    },
    {
      dedupingInterval: 60_000 * 5,
      revalidateOnFocus: false,
      fallbackData: [],
      onSuccess: (data) => {
        if (!data || !Array.isArray(data) || data.length === 0) return;
        const status = appStore.getState();
        if (!status.chatModel) {
          const firstProvider = data[0]?.provider;
          const model = data[0]?.models?.[0]?.name;
          if (firstProvider && model) {
            appStore.setState({ chatModel: { provider: firstProvider, model } });
          }
        }
      },
      ...options,
    },
  );
};
