import { createFileRoute } from "@tanstack/react-router";
import { Brain, Database, Server, Sparkles, MonitorSmartphone } from "lucide-react";

const TITLE = "About the Project — Developer Toolkit AI";
const DESCRIPTION =
  "How Developer Toolkit AI works: a React frontend, FastAPI backend, SQLite history store and the Groq API with the openai/gpt-oss-20b model.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: About,
});

const FLOW = [
  { icon: MonitorSmartphone, label: "React Frontend", note: "Forms, tool pages, results" },
  { icon: Server, label: "FastAPI Backend", note: "Validation, prompt building" },
  { icon: Brain, label: "AI Model", note: "Groq API — openai/gpt-oss-20b" },
  { icon: Sparkles, label: "Response", note: "Structured output" },
  { icon: MonitorSmartphone, label: "React Frontend", note: "Rendered result" },
];

function About() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">About the project</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        Developer Toolkit AI is a unified web application that brings eight everyday developer
        tasks into a single place: code review, bug explanation, SQL generation, regex
        generation, API documentation, commit messages, unit tests and Dockerfiles. The frontend
        collects your inputs, the backend builds tool-specific prompts, and the returned
        structured response is rendered as a copy-ready result.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Architecture</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {FLOW.map((step, index) => (
            <div key={`${step.label}-${index}`} className="panel p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-primary">
                  <step.icon className="size-4" aria-hidden />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{step.label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          React Frontend → FastAPI Backend → AI Model → Response → React Frontend
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="panel flex gap-4 p-5">
            <Database className="size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="text-sm font-semibold">SQLite database</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Stores every generation — tool, input summary, timestamp and status — so the history
                page can list and reopen past runs.
              </p>
            </div>
          </div>
          <div className="panel flex gap-4 p-5">
            <Brain className="size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="text-sm font-semibold">Groq AI</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Handles the actual generation. The backend builds a tool-specific prompt and returns
                a structured response to the frontend.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
