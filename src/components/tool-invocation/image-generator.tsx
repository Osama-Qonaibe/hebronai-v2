"use client";

import { ToolUIPart } from "ai";
import equal from "lib/equal";
import { cn } from "lib/utils";
import { ImagesIcon, Download, ExternalLink } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { TextShimmer } from "ui/text-shimmer";
import LetterGlitch from "ui/letter-glitch";

interface ImageGeneratorToolInvocationProps {
  part: ToolUIPart;
}

interface ImageGenerationResult {
  images: {
    url: string;
    mimeType?: string;
  }[];
  mode?: "create" | "edit" | "composite";
  guide?: string;
  model: string;
}

function PureImageGeneratorToolInvocation({
  part,
}: ImageGeneratorToolInvocationProps) {
  const isGenerating = useMemo(() => {
    return !part.state.startsWith("output");
  }, [part.state]);

  const result = useMemo(() => {
    if (!part.state.startsWith("output")) return null;
    return part.output as ImageGenerationResult;
  }, [part.state, part.output]);

  const images = useMemo(() => {
    return result?.images || [];
  }, [result]);

  const mode = useMemo(() => {
    return result?.mode || "create";
  }, [result]);

  const hasError = useMemo(() => {
    return (
      part.state === "output-error" ||
      (part.state === "output-available" && result?.images.length === 0)
    );
  }, [part.state, result]);

  const getModeText = (mode: string) => {
    switch (mode) {
      case "edit":
        return "Editing image...";
      case "composite":
        return "Compositing images...";
      default:
        return "Generating image...";
    }
  };

  const getModeHeader = (mode: string) => {
    switch (mode) {
      case "edit":
        return "Image edited";
      case "composite":
        return "Images composited";
      default:
        return "Image generated";
    }
  };

  const getDownloadUrl = useCallback((url: string, index: number) => {
    const ext = url.split(".").pop()?.split("?")[0] || "png";
    const filename = `image-${index + 1}.${ext}`;
    return `/api/image-download?url=${encodeURIComponent(url)}&filename=${filename}`;
  }, []);

  if (isGenerating) {
    return (
      <div className="flex flex-col gap-4">
        <TextShimmer>{getModeText(mode)}</TextShimmer>
        <div className="w-full h-96 overflow-hidden rounded-lg">
          <LetterGlitch />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Image generation may take up to 1 minute.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {!hasError && <ImagesIcon className="size-4" />}
        <span className="text-sm font-semibold">
          {hasError ? "Image generation failed" : getModeHeader(mode)}
        </span>
        <span className="text-xs text-muted-foreground">{result?.model}</span>
      </div>

      <div className="w-full flex flex-col gap-3 pb-2">
        {hasError ? (
          <div className="bg-card text-muted-foreground p-6 rounded-lg text-xs border border-border/20">
            {part.errorText ??
              (result?.images.length === 0
                ? "No images generated"
                : "Failed to generate image. Please try again.")}
          </div>
        ) : (
          <>
            <div
              className={cn(
                "grid gap-3",
                images.length === 1
                  ? "grid-cols-1 max-w-2xl"
                  : "grid-cols-1 md:grid-cols-2 max-w-3xl",
              )}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-border hover:border-primary transition-all shadow-sm hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    loading="lazy"
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2"
                    >
                      <ExternalLink className="size-4" />
                      Open
                    </a>
                    <a
                      href={getDownloadUrl(image.url, index)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      <Download className="size-4" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const ImageGeneratorToolInvocation = memo(
  PureImageGeneratorToolInvocation,
  (prev, next) => {
    return equal(prev.part, next.part);
  },
);
