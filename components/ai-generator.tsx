"use client";

import { useMemo, useState } from "react";

import { AiResultCard } from "@/components/ai-result-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { type ErrorResponse, type GenerateUseCaseResponse, type UseCaseInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

const MIN_CHAR_COUNT = 20;
const MAX_CHAR_COUNT = 600;

const STARTER_PROMPTS = [
  "Retail company struggling with inventory forecasting",
  "B2B SaaS team has high support ticket volume and slow response times",
  "Manufacturing business facing unplanned equipment downtime"
];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  result?: UseCaseInsight;
  error?: string;
  loading?: boolean;
};

export function AiGenerator() {
  const [businessProblem, setBusinessProblem] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charCount = businessProblem.trim().length;
  const canSubmit = !loading && charCount >= MIN_CHAR_COUNT;

  const hasConversation = useMemo(() => messages.length > 0, [messages]);

  const validateInput = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < MIN_CHAR_COUNT) {
      return `Please provide at least ${MIN_CHAR_COUNT} characters so we can generate meaningful insights.`;
    }
    return null;
  };

  const handleGenerate = async () => {
    const validationError = validateInput(businessProblem);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    const prompt = businessProblem.trim();
    const requestId = `msg_${Date.now()}`;

    setLoading(true);
    setInputError(null);
    setBusinessProblem("");
    setMessages((previous) => [
      ...previous,
      { id: `${requestId}_user`, role: "user", text: prompt },
      { id: `${requestId}_assistant`, role: "assistant", loading: true }
    ]);

    try {
      const response = await fetch("/api/generate-usecase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ businessProblem: prompt })
      });

      const payload = (await response.json()) as GenerateUseCaseResponse | ErrorResponse;

      if (!response.ok || "error" in payload) {
        const message = "error" in payload ? payload.error : "Failed to generate AI opportunities.";
        setMessages((previous) =>
          previous.map((entry) =>
            entry.id === `${requestId}_assistant` ? { ...entry, loading: false, error: message } : entry
          )
        );
        return;
      }

      setMessages((previous) =>
        previous.map((entry) =>
          entry.id === `${requestId}_assistant`
            ? { ...entry, loading: false, result: payload.data }
            : entry
        )
      );
    } catch {
      setMessages((previous) =>
        previous.map((entry) =>
          entry.id === `${requestId}_assistant`
            ? { ...entry, loading: false, error: "Unexpected network error. Please try again." }
            : entry
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const onStarterPromptClick = (prompt: string) => {
    if (loading) {
      return;
    }

    setBusinessProblem(prompt);
    setInputError(null);
  };

  const clearConversation = () => {
    if (loading) {
      return;
    }
    setMessages([]);
    setInputError(null);
  };

  return (
    <div className="space-y-5">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>AI Strategy Assistant</CardTitle>
          <CardDescription>
            Chat with Chiacon AI to explore tailored use cases and business impact for your problem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Conversation</p>
              <Button variant="outline" size="sm" onClick={clearConversation} disabled={!hasConversation || loading}>
                Clear
              </Button>
            </div>

            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {!hasConversation ? (
                <div className="rounded-md border border-dashed bg-background p-4 text-sm text-muted-foreground">
                  Start with a business challenge. You will receive a structured response with problem summary,
                  AI opportunities, and expected business impact.
                </div>
              ) : null}

              {messages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[88%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                        {message.text}
                      </div>
                    </div>
                  );
                }

                if (message.loading) {
                  return (
                    <div key={message.id} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                      <Spinner />
                      <span className="text-muted-foreground">Analyzing your problem and generating opportunities...</span>
                    </div>
                  );
                }

                if (message.error) {
                  return (
                    <div key={message.id} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {message.error}
                    </div>
                  );
                }

                if (message.result) {
                  return (
                    <AiResultCard
                      key={message.id}
                      result={message.result}
                      title="Chiacon AI Response"
                      className="animate-fade-in"
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border bg-background p-4">
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onStarterPromptClick(prompt)}
                  disabled={loading}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors",
                    "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="business-problem" className="text-sm font-medium text-foreground">
                Describe your business challenge
              </label>
              <Input
                id="business-problem"
                value={businessProblem}
                onChange={(event) => setBusinessProblem(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (canSubmit) {
                      void handleGenerate();
                    }
                  }
                }}
                placeholder="Example: Retail company struggling with inventory forecasting"
                maxLength={MAX_CHAR_COUNT}
                disabled={loading}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Press Enter to send</p>
                <p className="text-xs text-muted-foreground">
                  {charCount}/{MAX_CHAR_COUNT}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleGenerate} disabled={!canSubmit} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Spinner className="mr-1" /> Generating...
                  </>
                ) : (
                  "Send to AI Assistant"
                )}
              </Button>

              {inputError ? <p className="text-sm text-red-600">{inputError}</p> : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
