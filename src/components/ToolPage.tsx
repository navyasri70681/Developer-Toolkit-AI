import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Check, Copy, Download, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import { ResultBlocks } from "@/components/ResultBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultValues, type ToolConfig } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { ToolInput, ToolResult } from "@/services/api";

export function ToolPage({ tool }: { tool: ToolConfig }) {
  const [values, setValues] = useState<ToolInput>(() => defaultValues(tool));
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const Icon = tool.icon;

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate(): string | null {
    for (const field of tool.fields) {
      if (field.required && !values[field.name]?.trim()) {
        return `${field.label} is required.`;
      }
    }
    if (tool.slug === "dockerfile" && !/^\d{2,5}$/.test(values.port?.trim() ?? "")) {
      return "Port must be a number between 2 and 5 digits.";
    }
    const longField = tool.fields.find(
      (field) => field.mono && field.required && (values[field.name]?.trim().length ?? 0) < 10,
    );
    if (longField) {
      return `${longField.label} looks too short — paste at least a few lines.`;
    }
    return null;
  }

  async function handleGenerate() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const response = await tool.run(values);
      setResult(response);
    } catch {
      setError("The AI service could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setValues(defaultValues(tool));
    setResult(null);
    setError(null);
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.copyText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result.downloadName ?? `${tool.slug}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" aria-hidden />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-card text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Input column */}
        <div className="panel p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Input
          </h2>

          <div className="mt-5 space-y-5">
            {tool.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`${tool.slug}-${field.name}`} className="text-sm">
                  {field.label}
                  {field.required ? <span className="ml-1 text-primary">*</span> : null}
                </Label>

                {field.type === "select" ? (
                  <select
                    id={`${tool.slug}-${field.name}`}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValue(field.name, event.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : null}

                {field.type === "text" ? (
                  <Input
                    id={`${tool.slug}-${field.name}`}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => setValue(field.name, event.target.value)}
                  />
                ) : null}

                {field.type === "textarea" ? (
                  <Textarea
                    id={`${tool.slug}-${field.name}`}
                    rows={field.rows ?? 8}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => setValue(field.name, event.target.value)}
                    className={cn(
                      "resize-y leading-relaxed",
                      field.mono && "bg-code font-mono text-[13px] text-code-foreground",
                    )}
                    spellCheck={!field.mono}
                  />
                ) : null}
              </div>
            ))}
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-5 flex gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleGenerate} disabled={loading} className="sm:flex-1">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" aria-hidden />
                  {tool.actionLabel}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={loading}>
              <Trash2 className="size-4" aria-hidden />
              Clear
            </Button>
          </div>
        </div>

        {/* Result column */}
        <div className="panel flex min-h-100 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {tool.resultLabel}
            </h2>
            {result ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="size-3.5" aria-hidden />
                  Download
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex-1">
            {loading ? (
              <div className="space-y-3" aria-live="polite">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Analysing your input…
                </p>
                {[0, 1, 2, 3, 4].map((row) => (
                  <div
                    key={row}
                    className="h-3 animate-pulse rounded bg-muted"
                    style={{ width: `${95 - row * 12}%` }}
                  />
                ))}
              </div>
            ) : null}

            {!loading && !result ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
                <Icon className="size-6 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">{tool.emptyHint}</p>
              </div>
            ) : null}

            {!loading && result ? (
              <div className="space-y-5">
                <div className="rounded-lg border border-success/30 bg-success/10 p-4">
                  <p className="text-sm font-medium text-foreground">{result.headline}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
                </div>
                <ResultBlocks blocks={result.blocks} />
                <p className="border-t border-border pt-4 text-xs text-muted-foreground">
                  Demo output from the mock service layer. Real AI responses arrive once the FastAPI
                  backend is connected.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
