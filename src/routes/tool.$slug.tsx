import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ToolPage } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { getTool } from "@/lib/tools";

export const Route = createFileRoute("/tool/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { name: tool.name, short: tool.short };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tool not found — Developer Toolkit AI" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Developer Toolkit AI`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.short },
      ],
    };
  },
  notFoundComponent: ToolNotFound,
  component: ToolRoute,
});

function ToolRoute() {
  const { slug } = Route.useParams();
  const tool = getTool(slug);
  if (!tool) return <ToolNotFound />;
  return <ToolPage tool={tool} />;
}

function ToolNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Tool not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        That toolkit page doesn't exist. Pick one of the eight tools from the dashboard.
      </p>
      <Button asChild className="mt-6">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
