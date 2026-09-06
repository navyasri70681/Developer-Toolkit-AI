import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Developer Toolkit AI — one workspace for the developer tasks you do every day.
        </p>
        <div className="flex gap-4">
          <Link to="/dashboard" className="transition-colors hover:text-foreground">
            Toolkit
          </Link>
          <Link to="/history" className="transition-colors hover:text-foreground">
            History
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
