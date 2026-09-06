import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, History, ShieldCheck, Workflow } from "lucide-react";

import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools";

const TITLE = "Developer Toolkit AI — 8 AI Tools for Developers";
const DESCRIPTION =
  "Review code, explain bugs, generate SQL and regex, write API docs, commit messages, unit tests and Dockerfiles — eight AI developer tools in one place.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Home,
});

const BENEFITS = [
  {
    icon: Clock,
    title: "Less time on boilerplate",
    body: "Queries, tests, Dockerfiles and commit messages are drafted in seconds so you can stay on the actual problem.",
  },
  {
    icon: ShieldCheck,
    title: "Catch issues earlier",
    body: "Reviews flag security risks, performance traps and readability problems before they reach a pull request.",
  },
  {
    icon: Workflow,
    title: "One consistent workflow",
    body: "Every tool shares the same input and result layout, so switching between them takes no re-learning.",
  },
  {
    icon: History,
    title: "Everything is recorded",
    body: "Each generation is stored with its input summary and status, ready to revisit from the history page.",
  },
];

const PREVIEW_CODE = `POST /api/v1/reviews
{
  "language": "python",
  "code": "def create_order(payload): ..."
}

→ quality 6.5/10 · 3 issues · 1 security risk
  • SQL string concatenation (injection risk)
  • Connection opened inside the loop
  • Broad except clause swallows errors`;

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Your AI-Powered Developer Toolkit
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Review code, explain bugs, generate SQL and Regex, create API documentation, write
              commit messages, generate unit tests, and build Dockerfiles — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/dashboard">
                  Explore Developer Tools
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/history">View History</Link>
              </Button>
            </div>
          </div>

          <div className="panel min-w-0 p-4 shadow-panel">
            <div className="flex items-center gap-1.5 px-1 pb-3">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                toolkit · code-review
              </span>
            </div>
            <CodeBlock code={PREVIEW_CODE} language="preview" />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {TOOLS.slice(0, 4).map((tool) => (
                <div
                  key={tool.slug}
                  className="flex flex-col items-center gap-1.5 rounded-md border border-border bg-background/50 px-2 py-3 text-center"
                >
                  <tool.icon className="size-4 text-primary" aria-hidden />
                  <span className="text-[10px] leading-tight text-muted-foreground">
                    {tool.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold sm:text-3xl">Eight tools, one interface</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each tool takes a focused input and returns a structured, copy-ready result.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              to="/tool/$slug"
              params={{ slug: tool.slug }}
              className="panel group flex flex-col p-5 transition-colors hover:border-border-strong"
            >
              <tool.icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-4 text-sm font-semibold">{tool.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.short}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">
                Open tool
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">Why use the toolkit</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
                  <benefit.icon className="size-4.5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold">{benefit.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="panel flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold">Ready to open the toolkit?</h2>
            <ul className="mt-4 space-y-2">
              {["All 8 tools available", "Structured, copy-ready output", "History of every run"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary" aria-hidden />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <Button asChild size="lg">
            <Link to="/dashboard">
              Open Dashboard
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
