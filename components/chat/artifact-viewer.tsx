"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { registry } from "@/lib/json-render-registry";
import type { Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import {
  AlertCircle,
  ChevronRight,
  Database,
  FileText,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import * as React from "react";

interface ArtifactViewerProps {
  spec: Spec | null;
  isStreaming?: boolean;
  error?: Error | null;
  onClear?: () => void;
  onTest?: () => void;
}

const SUPPORTED_COMPONENTS = new Set([
  "Card",
  "Stack",
  "Grid",
  "Separator",
  "Tabs",
  "Accordion",
  "Table",
  "Heading",
  "Text",
  "Badge",
  "Alert",
  "Progress",
  "Button",
  "Avatar",
  "Collapsible",
  "Metric",
  "Chart",
]);

export default function ArtifactViewer({
  spec,
  isStreaming = false,
  error = null,
  onClear,
  onTest,
}: ArtifactViewerProps) {
  const hasSpec = spec !== null && spec.root !== "";

  const unknownTypes = React.useMemo(() => {
    if (!spec) return [] as string[];

    const types = new Set<string>();
    for (const element of Object.values(spec.elements ?? {})) {
      if (typeof element?.type === "string") {
        types.add(element.type);
      }
    }

    return Array.from(types).filter((type) => !SUPPORTED_COMPONENTS.has(type));
  }, [spec]);

  // Debug logging
  React.useEffect(() => {
    console.log("[ArtifactViewer] Props:", {
      spec,
      hasSpec,
      isStreaming,
      error,
    });
    if (spec) {
      console.log("[ArtifactViewer] Spec details:", {
        root: spec.root,
        elementKeys: Object.keys(spec.elements),
        elementTypes: Object.fromEntries(
          Object.entries(spec.elements).map(([key, element]) => [
            key,
            {
              type: element.type,
              hasVisible: element.visible !== undefined,
            },
          ]),
        ),
        elements: spec.elements,
      });
    }
  }, [spec, hasSpec, isStreaming, error]);

  return (
    <div className="flex h-full flex-col bg-card/85 backdrop-blur-md border border-border/60 rounded-2xl m-2 shadow-lg shadow-black/10">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/50 shrink-0">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">
            Workspace
          </span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground/80 font-medium">Artifacts</span>
        </nav>
      </div>

      {/* Title */}
      <div className="px-5 py-4 border-b border-border/50 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
              {isStreaming ? (
                <Loader2 className="size-4 text-primary animate-spin" />
              ) : (
                <FileText className="size-4 text-accent-foreground" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm leading-tight">
                {isStreaming
                  ? "Generating…"
                  : hasSpec
                    ? "Analysis Report"
                    : "Artifact Viewer"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isStreaming
                  ? "Transforming response into structured UI"
                  : hasSpec
                    ? "AI-generated structured view"
                    : "Context & data from AI responses"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isStreaming && (
              <Badge className="bg-primary/15 text-primary border border-primary/30 text-xs font-medium px-2">
                <Sparkles className="size-3 mr-1" />
                Streaming
              </Badge>
            )}
            {hasSpec && !isStreaming && (
              <Badge className="bg-secondary text-secondary-foreground border border-border text-xs font-medium px-2">
                Live
              </Badge>
            )}
            {!hasSpec && !isStreaming && (
              <Badge className="bg-secondary text-secondary-foreground border border-border text-xs font-medium px-2">
                Preview
              </Badge>
            )}
            {hasSpec && onClear && (
              <button
                onClick={onClear}
                className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Clear artifact"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <ErrorState error={error} />
      ) : hasSpec ? (
        <div className="flex-1 overflow-auto p-4">
          {unknownTypes.length > 0 && (
            <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
              Unknown component type(s): {unknownTypes.join(", ")}
            </div>
          )}

          <div className="artifact-viewer">
            <JSONUIProvider
              registry={registry}
              initialState={spec?.state ?? {}}
            >
              <Renderer
                spec={spec}
                registry={registry}
                fallback={({ element, children }) => (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                    Unsupported component: {String(element?.type ?? "unknown")}
                    {children}
                  </div>
                )}
              />
            </JSONUIProvider>
          </div>
        </div>
      ) : (
        <EmptyState onTest={onTest} />
      )}
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-3 max-w-55">
        <div className="mx-auto size-14 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
          <AlertCircle className="size-6 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground/80">
            Generation failed
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onTest }: { onTest?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-3 max-w-55">
        <div className="mx-auto size-14 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-inner">
          <Database className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground/80">
            No artifact selected
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Structured data, reports, and sources from AI responses will appear
            here
          </p>
        </div>
        {onTest && (
          <button
            onClick={onTest}
            className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
          >
            <Sparkles className="size-3" />
            Test with mock data
          </button>
        )}
      </div>

      {/* Skeleton preview cards */}
      <div className="mt-8 w-full space-y-3">
        <div className="rounded-xl border border-dashed border-border/40 p-4 space-y-3 opacity-50 bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Separator />
          <div className="space-y-2">
            {[80, 60, 90, 50].map((w, i) => (
              <div key={i} className="flex justify-between gap-4">
                <Skeleton
                  className="h-2.5 rounded"
                  style={{ width: `${w * 0.4}%` }}
                />
                <Skeleton
                  className="h-2.5 rounded"
                  style={{ width: `${w * 0.5}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-border/40 p-4 space-y-2 opacity-30 bg-muted/20 backdrop-blur-sm">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-full" />
          <Skeleton className="h-2.5 w-4/5" />
        </div>
      </div>
    </div>
  );
}
