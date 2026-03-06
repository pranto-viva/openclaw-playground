"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  compact?: boolean; // For use in artifacts with tighter spacing
}

export const MarkdownRenderer = ({
  content,
  className,
  compact = false,
}: MarkdownRendererProps) => {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className={cn(
                "text-2xl font-semibold first:mt-0",
                compact ? "mt-4 mb-2" : "mt-8 mb-4",
              )}
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className={cn(
                "text-xl font-semibold first:mt-0",
                compact ? "mt-4 mb-2" : "mt-8 mb-4",
              )}
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className={cn(
                "text-lg font-semibold first:mt-0",
                compact ? "mt-3 mb-2" : "mt-6 mb-3",
              )}
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className={cn(
                "leading-relaxed text-foreground last:mb-0 [[li_&]:mb-0] [[li_&]:inline]",
                compact ? "mb-2" : "mb-4",
              )}
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul
              className={cn(
                "list-disc list-outside ml-6",
                compact ? "my-2 space-y-1" : "my-4 space-y-2",
              )}
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className={cn(
                "list-decimal list-outside ml-6 font-bold text-foreground",
                compact ? "my-2 space-y-2" : "my-4 space-y-4",
              )}
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li
              className="leading-relaxed pl-1 font-normal text-foreground"
              {...props}
            />
          ),
          strong: ({ ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          code: ({
            inline,
            children,
            ...props
          }: React.HTMLAttributes<HTMLElement> & {
            inline?: boolean;
          }) =>
            inline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <div
                className={cn(
                  "rounded-md border bg-muted/50 overflow-hidden",
                  compact ? "my-2" : "my-4",
                )}
              >
                <code
                  className="block p-4 text-sm font-mono overflow-x-auto whitespace-pre"
                  {...props}
                >
                  {children}
                </code>
              </div>
            ),
          pre: ({ ...props }) => (
            <pre className="m-0 bg-transparent" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className={cn(
                "border-l-4 border-primary pl-4 italic text-muted-foreground",
                compact ? "my-3" : "my-6",
              )}
              {...props}
            />
          ),
          a: ({ ...props }) => (
            <a
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          hr: ({ ...props }) => (
            <hr
              className={cn("border-border", compact ? "my-4" : "my-8")}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
