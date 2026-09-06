import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Clock, Loader2, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOOLS } from "@/lib/tools";
import { getHistory, type HistoryItem } from "@/services/api";

const TITLE = "Generation History — Developer Toolkit AI";
const DESCRIPTION =
  "Browse past AI generations with tool name, input summary, timestamp and status, plus search and per-tool filtering.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HistoryPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: HistoryItem["status"] }) {
  const success = status === "success";
  return (
    <span
      className={
        success
          ? "inline-flex items-center rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-xs text-foreground"
          : "inline-flex items-center rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs text-foreground"
      }
    >
      {success ? "Success" : "Failed"}
    </span>
  );
}

function HistoryPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  const [query, setQuery] = useState("");
  const [toolFilter, setToolFilter] = useState("all");
  const [cleared, setCleared] = useState(false);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  const items = cleared ? [] : (data ?? []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesTool = toolFilter === "all" || item.toolSlug === toolFilter;
      const matchesQuery =
        !needle ||
        item.toolName.toLowerCase().includes(needle) ||
        item.inputSummary.toLowerCase().includes(needle) ||
        item.outputPreview.toLowerCase().includes(needle);
      return matchesTool && matchesQuery;
    });
  }, [items, query, toolFilter]);

  if (selected) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-6 text-muted-foreground"
          onClick={() => setSelected(null)}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to History
        </Button>

        <h1 className="text-2xl font-semibold sm:text-3xl">{selected.toolName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Run {selected.id}</p>

        <div className="panel mt-6 divide-y divide-border">
          {[
            { label: "Status", value: null },
            { label: "Created", value: formatDate(selected.createdAt) },
            { label: "Language", value: selected.language ?? "—" },
            { label: "Input summary", value: selected.inputSummary },
            { label: "Output preview", value: selected.outputPreview },
          ].map((row) => (
            <div key={row.label} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {row.label}
              </span>
              {row.value === null ? (
                <StatusBadge status={selected.status} />
              ) : (
                <span className="text-sm text-foreground">{row.value}</span>
              )}
            </div>
          ))}
        </div>

        <Button asChild className="mt-6">
          <Link to="/tool/$slug" params={{ slug: selected.toolSlug }}>
            Run this tool again
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Generation History</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every tool run is recorded with its input summary, timestamp and status.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setCleared(true);
            setSelected(null);
          }}
          disabled={items.length === 0}
        >
          <Trash2 className="size-4" aria-hidden />
          Clear History
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by tool, input or result"
            aria-label="Search history"
            className="pl-9"
          />
        </div>
        <select
          value={toolFilter}
          onChange={(event) => setToolFilter(event.target.value)}
          aria-label="Filter by tool"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:w-64"
        >
          <option value="all">All tools</option>
          {TOOLS.map((tool) => (
            <option key={tool.slug} value={tool.slug}>
              {tool.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading history…
          </p>
        ) : null}

        {isError ? (
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
          >
            <span className="flex items-center gap-2.5 text-sm">
              <AlertCircle className="size-4 text-destructive" aria-hidden />
              History could not be loaded.
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong px-6 py-16 text-center">
            <Clock className="size-6 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {items.length === 0
                ? "No history yet. Run a tool to see it listed here."
                : "No runs match your search or filter."}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">Open Toolkit</Link>
            </Button>
          </div>
        ) : null}

        {filtered.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="panel hidden overflow-hidden md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-background/40 text-left">
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Tool</th>
                    <th className="px-4 py-3 font-medium">Input summary</th>
                    <th className="px-4 py-3 font-medium">Date / time</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-accent/40">
                      <td className="px-4 py-3 font-medium">{item.toolName}</td>
                      <td className="max-w-sm px-4 py-3 text-muted-foreground">
                        {item.inputSummary}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelected(item)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((item) => (
                <li key={item.id} className="panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold">{item.toolName}</h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.inputSummary}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setSelected(item)}
                  >
                    View
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
