"use client";

import * as React from "react";
import {
  Send,
  Bot,
  User,
  AlertCircle,
  Database,
  Loader2,
  Sparkles,
  Clock,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useUIStream } from "@json-render/react";
import type { Spec } from "@json-render/core";
import ArtifactViewer from "@/components/chat/artifact-viewer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MessageMetadata {
  report_id: string;
  timestamp: string;
  confidence_score: number;
  sources: string[];
}

interface MessageUsage {
  input_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  total_tokens: number;
  session_total_tokens: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
  usage?: MessageUsage;
  trace_id?: string;
  isError?: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function postChat(query: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, channel: "whatsapp" }),
  });
  if (!res.ok) throw new Error(`Server error ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── Mock data (temporary, for testing artifact generation) ───────────────────

// const MOCK_REPLY = `Based on the analysis of hundreds of AI-generated call summaries from the forensic database, the most common reasons for customer and rider calls are:

// ### 1. Order Cancellations & Modifications (Most Frequent)
// - **Long Wait/Distance:** Customers frequently request cancellations when assigned riders (especially on bicycles) are too far away or estimate a long delivery time (often 1–1.5 hours).
// - **Unavailable Items:** Merchants or riders call to report that specific food items (e.g., Pork Curry, Chicken Spicy Burger) are out of stock, leading to partial or full cancellations.
// - **Incorrect Location:** Requests to cancel because the customer accidentally provided the wrong delivery address or the rider found the pickup point too far from their actual location.
// - **Closed Restaurants:** Riders reporting that a restaurant is physically closed despite the app showing it as active.

// ### 2. Technical & Account Issues
// - **ID/Account Suspension:** Riders frequently call to inquire why their accounts are blocked. Common reasons include "offline trip" violations, unprofessional behavior, or high outstanding "due" balances.
// - **Onboarding & Verification:** New riders following up on pending document verification (Bluebook, insurance, citizenship) or missing "agreement papers."
// - **App Glitches:** Calls regarding missing "Quest" (incentive) bonuses, inability to receive ride requests despite being online, and issues with the "CityPay" KYC verification.

// ### 3. Payment & Fare Disputes
// - **Overcharging:** Customers reporting that riders demanded more than the app-calculated fare or didn't apply promo codes correctly.
// - **Payment Failures:** Riders reporting that customers were unable to pay via mobile banking or eSewa due to technical failures.
// - **Deduction Clarification:** Riders questioning why their "due" balance increased, often explained by agents as penalties for "Quest Fraud."

// ### 4. Logistics & Safety
// - **Unreachable Customers:** Riders waiting at pickup/delivery locations for extended periods (5–30 mins) because the customer is not answering their phone.
// - **Accidents & Emergencies:** Riders reporting road accidents or vehicle breakdowns and seeking guidance on insurance claims.
// - **Item Issues:** Customers calling to add items or complaining about wrong/poor-quality food.

// ### 5. Proactive Verification
// - **High-Value Orders:** Agents proactively calling customers to verify large/high-value food orders (e.g., orders worth 5,000 to 19,000 NPR) to ensure validity before preparation.

// Source: asr_transcriptions.sqlite (Table: transcription_details > summary column)`;

const MOCK_REPLY = `Based on an analysis of AI-generated summaries specifically filtering for keywords related to frustration (e.g., "frustrated," "dissatisfied," "complained," "overcharged"), the most frequent customer and rider frustrations are:

### 1. Technical & App Issues (2,674 mentions)
This is the leading source of frustration. It includes:
*   **Account Suspensions/Blocks:** Riders frustrated by IDs being blocked due to "due" payments or performance metrics.
*   **OTP/Login Failures:** Difficulty receiving verification codes (especially on NTC networks).
*   **Payment Synchronization:** Payments made via "CityPay" not reflecting instantly in the Pathao account, leading to account restrictions.

### 2. Delays (2,613 mentions)
Close behind technical issues are frustrations related to time:
*   **Food Preparation:** Customers waiting over an hour for food orders (notably from KFC and biryani outlets).
*   **Rider Assignment:** Long wait times for a rider to be assigned during peak hours.
*   **Unreachable Riders:** Frustration when a rider accepts an order but stays stationary or takes a long route.

### 3. Cancellations & Item Unavailability (1,908 mentions)
*   **Late Notifications:** Customers being notified 30+ minutes after ordering that the restaurant is closed or an item is out of stock.
*   **Forced Cancellations:** Customers being asked by riders to cancel the order because the distance is too far for a bicycle.

### 4. Communication Gaps (848 mentions)
*   **Unresponsive Support:** Frustration over dead air on calls or repeated "hello" with no resolution.
*   **Unreachable Parties:** Significant irritation when either a rider or customer refuses to answer calls after a booking is confirmed.

### 5. Rider Behavior & Overcharging (366 mentions)
While lower in volume, these cases involve the highest intensity of frustration:
*   **Offline Trips:** Customers being overcharged on trips where the rider didn't use the meter or app.
*   **Harassment/Misbehavior:** Reports of riders using offensive language or making threats after a dispute.



`;

const ARTIFACT_BASE_SPEC: Spec = {
  root: "artifact-root",
  elements: {
    "artifact-root": {
      type: "Card",
      props: {},
      children: ["artifact-stack"],
    },
    "artifact-stack": {
      type: "Stack",
      props: {
        direction: "vertical",
        gap: "md",
      },
      children: ["artifact-title", "artifact-subtitle"],
    },
    // "artifact-title": {
    //   type: "Heading",
    //   props: {
    //     level: 3,
    //     text: "Generating analysis…",
    //   },
    //   children: [],
    // },
    // "artifact-subtitle": {
    //   type: "Text",
    //   props: {
    //     text: "Preparing structured view from the response stream.",
    //   },
    //   children: [],
    // },
  },
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-1 py-1">
      <div className="flex gap-1 items-end">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{
              animationDelay: `${i * 160}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        Analyzing your query…
      </span>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-1.5",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div className="mt-1 shrink-0">
        {isUser ? (
          <div className="size-8 rounded-full bg-secondary border border-border flex items-center justify-center shadow-sm">
            <User className="size-4 text-secondary-foreground" />
          </div>
        ) : (
          <div className="size-8 rounded-full border border-border flex items-center justify-center shadow-sm bg-primary text-black">
            <Bot className="size-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col gap-1.5 max-w-[72%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-linear-to-br from-primary via-primary to-primary/85 text-primary-foreground rounded-tr-sm shadow-md shadow-primary/25"
              : message.isError
                ? "bg-destructive/10 backdrop-blur-md border border-destructive/35 text-destructive rounded-tl-sm"
                : "bg-white/5 backdrop-blur-xl border border-white/10 text-card-foreground rounded-tl-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(255,255,255,0.03),0_4px_16px_rgba(0,0,0,0.08)]",
          )}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="size-4 text-destructive shrink-0" />
              <span className="font-semibold text-destructive text-xs uppercase tracking-wide">
                Request failed
              </span>
            </div>
          )}
          <p className="whitespace-pre-wrap wrap-break-word">
            {message.content}
          </p>
        </div>

        {/* Footer meta */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[11px] text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {!isUser && message.metadata?.report_id && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {message.metadata.report_id}
              </span>
            </>
          )}
          {!isUser &&
            message.metadata &&
            message.metadata.sources.length > 0 && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Database className="size-3" />
                  {message.metadata.sources.length} source
                  {message.metadata.sources.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty state for chat ──────────────────────────────────────────────────────

const SUGGESTIONS = [
  "What is the ratio of incoming vs. outgoing calls?",
  "Search summaries for keywords such as: refund,cancellation,delay",
  "What are the most common reasons for customer calls based on AI-generated summaries?",
  "Retrieve a summary of the most recent Sad call to understand what went wrong.",
];

function ChatEmptyState({
  onSuggestion,
}: {
  onSuggestion: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16 space-y-6">
      <div className="relative">
        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles className="size-7 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-accent border-2 border-background flex items-center justify-center">
          <div className="size-2 rounded-full bg-foreground animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="font-semibold text-foreground text-base">
          Geeky is ready
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your Enterprise Audit Command AI. Ask anything about funds, providers,
          or audit data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 w-full max-w-sm">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="group text-left text-xs px-3.5 py-2.5 rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm hover:border-ring hover:bg-accent/80 hover:text-accent-foreground text-muted-foreground transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm"
          >
            <span className="line-clamp-2 leading-relaxed">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Chat Interface ───────────────────────────────────────────────────────

export default function ChatInterface() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const startTimeRef = React.useRef<number>(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Artifact generation via json-render
  const {
    spec: artifactSpec,
    isStreaming: artifactStreaming,
    error: artifactError,
    send: sendToArtifact,
    clear: clearArtifact,
  } = useUIStream({
    api: "/api/generate-artifact",
    onError: (err) => console.error("[artifact]", err),
  });

  // Timer effect for elapsed time
  React.useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading]);

  // Auto-scroll to bottom on new messages or loading
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userContent = input.trim();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const data = await postChat(userContent);

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        metadata: data.metadata,
        usage: data.usage,
        trace_id: data.trace_id,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Trigger artifact generation from the reply
      sendToArtifact(data.reply, { previousSpec: ARTIFACT_BASE_SPEC }).catch(
        (err) => console.error("[artifact] generation failed:", err),
      );
    } catch (err) {
      const assistantErrMsg: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please check your connection and try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, assistantErrMsg]);
    } finally {
      setIsLoading(false);
      // Restore focus to textarea
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTestArtifact = () => {
    sendToArtifact(MOCK_REPLY, { previousSpec: ARTIFACT_BASE_SPEC }).catch(
      (err) => console.error("[artifact] test failed:", err),
    );
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative h-screen flex flex-col bg-background overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-flow opacity-85" />

      {/* Top bar */}
      <header className="shrink-0 h-12 flex items-center px-5 border-b border-border/50 bg-card/85 backdrop-blur-md gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="size-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">
            OpenClaw
          </span>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-sm text-muted-foreground">Playground</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <span className="size-1.5 rounded-full bg-primary animate-pulse inline-block" />
            Live
          </div>
          <Badge
            variant="outline"
            className="text-xs border-border text-muted-foreground font-normal"
          >
            whatsapp channel
          </Badge>
        </div>
      </header>

      {/* Main content */}
      <ResizablePanelGroup
        orientation="horizontal"
        className="flex-1 min-h-0 relative z-10"
      >
        {/* Left: Artifact Panel */}
        <ResizablePanel
          defaultSize={35}
          minSize={35}
          //   maxSize={55}
          className="min-w-0 mb-4"
        >
          <ArtifactViewer
            spec={artifactSpec}
            isStreaming={artifactStreaming}
            error={artifactError}
            onClear={clearArtifact}
            onTest={handleTestArtifact}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Chat Panel */}
        <ResizablePanel defaultSize={65} minSize={35} className="min-w-0">
          <div className="flex h-full flex-col bg-background/35">
            {/* Chat header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-border/50 bg-card/85 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                    <Bot className="size-4 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    Geeky
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enterprise Audit Command
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Loader2 className="size-3 animate-spin" />
                    <span>Processing</span>
                    <span className="text-muted-foreground">
                      ({elapsedTime}s)
                    </span>
                  </div>
                )}
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  <Hash className="size-3 mr-1" />
                  {
                    messages.filter((m) => m.role === "assistant" && !m.isError)
                      .length
                  }{" "}
                  responses
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
              <div className="pb-4">
                {isEmpty ? (
                  <ChatEmptyState onSuggestion={(s) => setInput(s)} />
                ) : (
                  <div className="pt-4 space-y-0.5">
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} />
                    ))}
                  </div>
                )}

                {/* Loading bubble */}
                {isLoading && (
                  <div className="flex items-start gap-3 px-4 py-2 mt-0.5">
                    <div className="mt-1 size-8 rounded-full bg-primary flex items-center justify-center shrink-0 ring-2 ring-ring/30 shadow-sm">
                      <Bot className="size-4 text-primary-foreground" />
                    </div>
                    <div className="bg-card/85 backdrop-blur-sm border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-px" />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="shrink-0 px-4 py-3 border-t border-border/50 bg-card/85 backdrop-blur-md">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200 min-h-13",
                  "bg-input/75 backdrop-blur-sm border-border/60",
                  "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 focus-within:bg-input/80",
                  isLoading && "opacity-60 pointer-events-none",
                )}
              >
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Geeky anything…"
                  rows={1}
                  className="flex-1 w-full min-h-7 max-h-30 resize-none border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none leading-relaxed flex items-center"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon-sm"
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-150 disabled:opacity-30 shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between mt-1.5 px-0.5">
                <p className="text-[11px] text-muted-foreground">
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono border border-border text-muted-foreground">
                    Enter
                  </kbd>{" "}
                  to send ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono border border-border text-muted-foreground">
                    Shift+Enter
                  </kbd>{" "}
                  for new line
                </p>
                {messages.length > 0 && (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    {messages[messages.length - 1].timestamp.toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
