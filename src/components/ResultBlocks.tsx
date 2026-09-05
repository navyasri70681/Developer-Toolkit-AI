import { CodeBlock } from "@/components/CodeBlock";
import type { ResultBlock } from "@/services/api";

export function ResultBlocks({ blocks }: { blocks: ResultBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <section key={`${block.title}-${index}`} className="space-y-2">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
            {block.title}
          </h3>

          {block.kind === "text" ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{block.body}</p>
          ) : null}

          {block.kind === "list" ? (
            <ul className="space-y-2">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {block.kind === "code" ? <CodeBlock code={block.code} language={block.language} /> : null}

          {block.kind === "meta" ? (
            <dl className="grid gap-x-6 gap-y-2 rounded-lg border border-border bg-background/40 p-4 sm:grid-cols-2">
              {block.entries.map((entry) => (
                <div key={entry.label} className="text-sm">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {entry.label}
                  </dt>
                  <dd className="mt-0.5 text-foreground">{entry.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ))}
    </div>
  );
}
