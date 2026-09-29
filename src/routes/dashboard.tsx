import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bookmark, Layers, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools";
import { getHistory } from "@/services/api";

const TITLE = "Developer Toolkit — Developer Toolkit AI";
const DESCRIPTION =
  "Choose from eight AI-powered developer tools: code review, bug explanation, SQL, regex, API docs, commit messages, unit tests and Dockerfiles.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [requestCount, setRequestCount] = useState(0);
  const [savedResults, setSavedResults] = useState(0);

  useEffect(() => {
    getHistory()
      .then((history) => {
        const today = new Date().toDateString();

        const requestsToday = history.filter(
          (item) => new Date(item.createdAt).toDateString() === today
        ).length;

        setRequestCount(requestsToday);
        setSavedResults(history.length);
      })
      .catch(() => {
        setRequestCount(0);
        setSavedResults(0);
      });
  }, []);

  const stats = [
    { label: "AI Tools", value: String(TOOLS.length), icon: Layers },
    { label: "Requests Today", value: String(requestCount), icon: Zap },
    { label: "Saved Results", value: String(savedResults), icon: Bookmark },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">Developer Toolkit</h1>

      <p className="mt-3 max-w-2xl text-muted-foreground">
        Choose an AI-powered tool to improve your development workflow.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="panel flex items-center gap-4 p-5">
            <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary">
              <stat.icon className="size-4.5" aria-hidden />
            </span>

            <div>
              <p className="font-display text-2xl font-semibold leading-none">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <article
            key={tool.slug}
            className="panel flex flex-col p-5 transition-colors hover:border-border-strong"
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-primary">
              <tool.icon className="size-4.5" aria-hidden />
            </span>

            <h2 className="mt-4 text-base font-semibold">{tool.name}</h2>

            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {tool.short}
            </p>

            <Button asChild variant="outline" size="sm" className="mt-5 w-full">
              <Link to="/tool/$slug" params={{ slug: tool.slug }}>
                Open Tool
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
