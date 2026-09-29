import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/CodeBlock";
import type { ResultBlock } from "@/services/api";

function normalizeMarkdown(text: string) {
  return text.replace(/\\([#*_`])/g, "$1");
}

export function ResultBlocks({ blocks }: { blocks: ResultBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => (
        <section key={`${block.title}-${index}`} className="space-y-2">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
            {block.title}
          </h3>

          {block.kind === "text" ? (
            <div className="prose prose-sm max-w-none text-muted-foreground prose-headings:font-display prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-transparent">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const code = String(children).replace(/\n$/, "");

                    if (match) {
                      return (
                        <CodeBlock
                          code={code}
                          language={match[1].replace(/Copy$/i, "")}
                        />
                      );
                    }

                    return (
                      <code
                        className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {normalizeMarkdown(block.body)}
              </ReactMarkdown>
            </div>
          ) : null}

          {block.kind === "list" ? (
            <ul className="space-y-2">
              {block.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

{block.kind === "code" ? (
  <CodeBlock
    code={block.code}
    language={block.language?.replace(/Copy$/i, "")}
  />
) : null}
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
