/**
 * Mock API service layer for Developer Toolkit AI.
 *
 * Every function here simulates a network round-trip and returns a realistic
 * response shape. When the FastAPI backend is ready, replace the bodies of
 * these functions with `fetch(`${API_BASE}/...`)` calls — the rest of the app
 * only depends on the exported types and function signatures.
 */

export const API_BASE = "/api"; // future FastAPI base url

export type ResultBlock =
  | { kind: "text"; title: string; body: string }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "code"; title: string; language: string; code: string }
  | { kind: "meta"; title: string; entries: { label: string; value: string }[] };

export type ToolResult = {
  headline: string;
  summary: string;
  blocks: ResultBlock[];
  /** Primary text used by the copy button and download action. */
  copyText: string;
  downloadName?: string;
};

export type ToolInput = Record<string, string>;

export type HistoryStatus = "success" | "failed";

export type HistoryItem = {
  id: string;
  toolSlug: string;
  toolName: string;
  inputSummary: string;
  createdAt: string;
  status: HistoryStatus;
  language?: string;
  outputPreview: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simulates latency + an occasional transport failure surface for error states. */
async function request<T>(payload: unknown, build: () => T, ms = 900): Promise<T> {
  await delay(ms);
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request payload.");
  }
  return build();
}

export async function reviewCode(input: ToolInput): Promise<ToolResult> {
  return request(input, () => {
    const language = input.language || "Python";
    return {
      headline: "Code review complete",
      summary: `Static + AI review for ${language}. 3 issues found, 1 of them security related.`,
      blocks: [
        {
          kind: "meta",
          title: "Summary",
          entries: [
            { label: "Overall quality", value: "6.5 / 10" },
            { label: "Readability", value: "Good" },
            { label: "Issues found", value: "3" },
            { label: "Severity", value: "Medium" },
          ],
        },
        {
          kind: "list",
          title: "Issues",
          items: [
            "No input validation on the incoming request body — malformed payloads raise an unhandled exception.",
            "Database connection is opened inside the loop instead of being reused, causing connection churn.",
            "Broad `except` clause swallows real errors and makes debugging harder.",
          ],
        },
        {
          kind: "list",
          title: "Security",
          items: [
            "User input is concatenated into the SQL string — use parameterised queries to prevent SQL injection.",
            "Secrets are read from a hardcoded constant; move them to environment variables.",
          ],
        },
        {
          kind: "list",
          title: "Performance",
          items: [
            "The N+1 query pattern issues one query per record; batch with a single `IN (...)` lookup.",
            "Repeated list membership checks are O(n) — convert the lookup list into a set.",
          ],
        },
        {
          kind: "list",
          title: "Suggested improvements",
          items: [
            "Extract the validation logic into a small helper for reuse and testing.",
            "Add type hints and a docstring describing the return contract.",
            "Wrap the DB access in a context manager so connections always close.",
            "Add unit tests for the empty-input and duplicate-record paths.",
          ],
        },
      ],
      copyText: [
        `Code review (${language})`,
        "Overall quality: 6.5/10",
        "",
        "Issues:",
        "- Missing input validation",
        "- Connection opened inside the loop",
        "- Broad except clause",
        "",
        "Security:",
        "- SQL string concatenation (injection risk)",
        "- Hardcoded secret",
        "",
        "Performance:",
        "- N+1 queries",
        "- O(n) membership checks",
      ].join("\n"),
      downloadName: "code-review.md",
    };
  });
}

export async function explainBug(input: ToolInput): Promise<ToolResult> {
  return request(input, () => ({
    headline: "Bug explained",
    summary: "The error is raised because a value that can be `None` is used as if it were a list.",
    blocks: [
      {
        kind: "text",
        title: "Problem",
        body: "`TypeError: 'NoneType' object is not subscriptable` — the code indexes into a value that ended up being null instead of a collection.",
      },
      {
        kind: "text",
        title: "Root cause",
        body: "The lookup function returns `None` when no record matches, but the caller assumes a record always exists and immediately reads `result[0]`.",
      },
      {
        kind: "text",
        title: "Detailed explanation",
        body: "At runtime the query filter matched zero rows, so the helper fell through to its implicit `return None`. Python evaluates the subscript on that `None` object, which has no `__getitem__`, and raises the TypeError. This only appears for inputs with no matching row, which is why it passes locally with seeded data and fails in production.",
      },
      {
        kind: "list",
        title: "Suggested fix",
        items: [
          "Guard the result before indexing it.",
          "Return an explicit empty list from the helper instead of `None`.",
          "Raise a domain error (e.g. 404) when the record genuinely must exist.",
        ],
      },
      {
        kind: "code",
        title: "Corrected code",
        language: input.language?.toLowerCase() || "python",
        code: `def get_user_email(user_id: int) -> str | None:
    record = db.find_user(user_id)
    if record is None:
        # explicit, testable branch instead of an implicit None
        return None
    return record["email"]


email = get_user_email(user_id)
if email is None:
    raise HTTPException(status_code=404, detail="User not found")`,
      },
    ],
    copyText:
      "TypeError: 'NoneType' object is not subscriptable\n\nCause: the lookup helper returns None when no row matches, but the caller indexes the result directly.\n\nFix: guard the result before indexing, or return an empty value / raise a 404.",
    downloadName: "bug-explanation.md",
  }));
}

export async function generateSQL(input: ToolInput): Promise<ToolResult> {
  return request(input, () => ({
    headline: "SQL query generated",
    summary: `Dialect: ${input.database || "PostgreSQL"} — 1 query, 2 joins, 1 aggregate.`,
    blocks: [
      {
        kind: "code",
        title: "Query",
        language: "sql",
        code: `SELECT
    c.id                AS customer_id,
    c.full_name,
    COUNT(o.id)         AS total_orders,
    SUM(o.amount)       AS lifetime_value
FROM customers AS c
JOIN orders    AS o ON o.customer_id = c.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND o.status = 'completed'
GROUP BY c.id, c.full_name
HAVING SUM(o.amount) > 500
ORDER BY lifetime_value DESC
LIMIT 20;`,
      },
      {
        kind: "text",
        title: "Explanation",
        body: "Customers are joined to their completed orders from the last 30 days. Rows are grouped per customer so `COUNT` and `SUM` aggregate per person, `HAVING` keeps only customers above 500 in spend, and the result is sorted by lifetime value with the top 20 returned.",
      },
      {
        kind: "list",
        title: "Notes",
        items: [
          "Add an index on `orders(customer_id, created_at)` for large tables.",
          "Use `LEFT JOIN` instead if customers with zero orders should appear.",
          "Interval syntax differs on MySQL/SQLite — regenerate with the matching dialect.",
        ],
      },
    ],
    copyText: `SELECT
    c.id AS customer_id,
    c.full_name,
    COUNT(o.id) AS total_orders,
    SUM(o.amount) AS lifetime_value
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND o.status = 'completed'
GROUP BY c.id, c.full_name
HAVING SUM(o.amount) > 500
ORDER BY lifetime_value DESC
LIMIT 20;`,
    downloadName: "query.sql",
  }));
}

export async function generateRegex(input: ToolInput): Promise<ToolResult> {
  return request(input, () => ({
    headline: "Regex generated",
    summary: "Pattern validated against 5 sample strings.",
    blocks: [
      {
        kind: "code",
        title: "Pattern",
        language: "regex",
        code: `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$`,
      },
      {
        kind: "list",
        title: "How it works",
        items: [
          "`^` anchors the match at the start of the string.",
          "`[A-Za-z0-9._%+-]+` matches the local part before the @ sign.",
          "`@[A-Za-z0-9.-]+` matches the domain name and any subdomains.",
          "`\\.[A-Za-z]{2,}` requires a dot followed by a 2+ letter top-level domain.",
          "`$` anchors the match at the end so trailing junk is rejected.",
        ],
      },
      {
        kind: "list",
        title: "Example matches",
        items: ["navya@college.edu", "dev.team+ai@toolkit.io", "meghana_99@example.co.in"],
      },
      {
        kind: "list",
        title: "Non-matches",
        items: ["missing-at-sign.com", "user@localhost", "user@@double.com"],
      },
    ],
    copyText: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
    downloadName: "pattern.txt",
  }));
}

export async function generateDocs(input: ToolInput): Promise<ToolResult> {
  return request(input, () => ({
    headline: "API documentation generated",
    summary: `${input.framework || "FastAPI"} — 2 endpoints documented.`,
    blocks: [
      {
        kind: "meta",
        title: "POST /api/v1/reviews",
        entries: [
          { label: "Description", value: "Submits a code snippet for AI review." },
          { label: "Auth", value: "Bearer token required" },
          { label: "Content type", value: "application/json" },
          { label: "Rate limit", value: "30 requests / minute" },
        ],
      },
      {
        kind: "code",
        title: "Request body",
        language: "json",
        code: `{
  "language": "python",
  "code": "def add(a, b): return a + b",
  "depth": "standard"
}`,
      },
      {
        kind: "code",
        title: "Successful response — 200",
        language: "json",
        code: `{
  "id": "rev_8f21",
  "quality_score": 6.5,
  "issues": [
    { "severity": "medium", "message": "Missing input validation" }
  ],
  "created_at": "2026-09-05T05:12:44Z"
}`,
      },
      {
        kind: "list",
        title: "Error responses",
        items: [
          "400 — `code` field is empty or exceeds 20,000 characters.",
          "401 — missing or expired bearer token.",
          "429 — rate limit exceeded, retry after the `Retry-After` header.",
          "503 — upstream AI provider unavailable.",
        ],
      },
      {
        kind: "meta",
        title: "GET /api/v1/reviews/{id}",
        entries: [
          { label: "Description", value: "Fetches a stored review by id." },
          { label: "Path param", value: "id — review identifier" },
          { label: "Returns", value: "The same object shape as the POST response" },
        ],
      },
    ],
    copyText:
      "POST /api/v1/reviews — submit a code snippet for AI review.\nGET /api/v1/reviews/{id} — fetch a stored review.\n\nRequest: { language, code, depth }\nResponse: { id, quality_score, issues[], created_at }\nErrors: 400, 401, 429, 503",
    downloadName: "api-docs.md",
  }));
}

export async function generateCommitMessage(input: ToolInput): Promise<ToolResult> {
  const type = input.type || "feat";
  return request(input, () => ({
    headline: "Commit message generated",
    summary: "Conventional Commits format, 72-character subject limit respected.",
    blocks: [
      {
        kind: "code",
        title: "Recommended message",
        language: "text",
        code: `${type}(history): persist tool runs and add search filters

Store every generation in SQLite with the tool slug, input summary and
status so the history page can list past runs. Adds keyword search and a
per-tool filter, plus a detail view for a single run.

Refs #142`,
      },
      {
        kind: "list",
        title: "Alternative suggestions",
        items: [
          `${type}(history): save generations and support filtering`,
          `${type}: add generation history with search and tool filter`,
          `${type}(api): return stored history records for the dashboard`,
        ],
      },
      {
        kind: "list",
        title: "Style notes",
        items: [
          "Subject uses the imperative mood and stays under 72 characters.",
          "Body explains why the change was made, not just what changed.",
          "Footer references the tracking issue for traceability.",
        ],
      },
    ],
    copyText: `${type}(history): persist tool runs and add search filters

Store every generation in SQLite with the tool slug, input summary and
status so the history page can list past runs. Adds keyword search and a
per-tool filter, plus a detail view for a single run.

Refs #142`,
    downloadName: "commit-message.txt",
  }));
}

export async function generateUnitTests(input: ToolInput): Promise<ToolResult> {
  const framework = input.framework || "pytest";
  return request(input, () => ({
    headline: "Unit tests generated",
    summary: `${framework} — 5 test cases including 2 edge cases.`,
    blocks: [
      {
        kind: "code",
        title: "Test file",
        language: input.language?.toLowerCase() || "python",
        code: `import pytest

from app.pricing import apply_discount


def test_applies_percentage_discount():
    assert apply_discount(200, 10) == 180


def test_zero_discount_returns_original_price():
    assert apply_discount(150, 0) == 150


def test_full_discount_returns_zero():
    assert apply_discount(99.5, 100) == 0


@pytest.mark.parametrize("percent", [-5, 101])
def test_rejects_out_of_range_discount(percent):
    with pytest.raises(ValueError):
        apply_discount(100, percent)


def test_rejects_negative_price():
    with pytest.raises(ValueError):
        apply_discount(-1, 10)`,
      },
      {
        kind: "list",
        title: "Test cases",
        items: [
          "Applies a standard percentage discount correctly.",
          "A zero discount leaves the price unchanged.",
          "A 100% discount reduces the price to zero.",
        ],
      },
      {
        kind: "list",
        title: "Edge cases covered",
        items: [
          "Discount percentages outside the 0–100 range raise `ValueError`.",
          "Negative prices are rejected before any calculation.",
          "Floating point prices round to two decimals as expected.",
        ],
      },
      {
        kind: "text",
        title: "Run",
        body: "pytest -q tests/test_pricing.py",
      },
    ],
    copyText: `import pytest

from app.pricing import apply_discount


def test_applies_percentage_discount():
    assert apply_discount(200, 10) == 180


def test_zero_discount_returns_original_price():
    assert apply_discount(150, 0) == 150`,
    downloadName: "test_generated.py",
  }));
}

export async function generateDockerfile(input: ToolInput): Promise<ToolResult> {
  const port = input.port || "8000";
  return request(input, () => ({
    headline: "Dockerfile generated",
    summary: `Multi-stage build for ${input.framework || "FastAPI"}, exposing port ${port}.`,
    blocks: [
      {
        kind: "code",
        title: "Dockerfile",
        language: "dockerfile",
        code: `FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE ${port}

HEALTHCHECK --interval=30s --timeout=3s \\
  CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:${port}/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${port}"]`,
      },
      {
        kind: "code",
        title: "Build & run",
        language: "bash",
        code: `docker build -t developer-toolkit-api .
docker run --rm -p ${port}:${port} --env-file .env developer-toolkit-api`,
      },
      {
        kind: "code",
        title: ".dockerignore",
        language: "text",
        code: `__pycache__/
*.pyc
.venv/
.env
tests/
*.sqlite3`,
      },
      {
        kind: "list",
        title: "Notes",
        items: [
          "Runs as a non-root user for safer container defaults.",
          "Dependencies are copied before the source so layer caching works.",
          "Mount a volume if the SQLite database must survive restarts.",
        ],
      },
    ],
    copyText: `FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE ${port}
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${port}"]`,
      downloadName: "Dockerfile",
  }));
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "gen_1042",
    toolSlug: "code-review",
    toolName: "Code Review",
    inputSummary: "FastAPI route handler for creating orders (78 lines)",
    createdAt: "2026-09-05T04:58:00Z",
    status: "success",
    language: "Python",
    outputPreview: "Quality 6.5/10 — 3 issues, SQL injection risk in the filter clause.",
  },
  {
    id: "gen_1041",
    toolSlug: "sql-generator",
    toolName: "SQL Query Generator",
    inputSummary: "Top 20 customers by spend in the last 30 days",
    createdAt: "2026-09-05T04:31:00Z",
    status: "success",
    language: "PostgreSQL",
    outputPreview: "SELECT c.id, c.full_name, COUNT(o.id) ... HAVING SUM(o.amount) > 500",
  },
  {
    id: "gen_1040",
    toolSlug: "bug-explain",
    toolName: "Bug Explanation",
    inputSummary: "TypeError: 'NoneType' object is not subscriptable",
    createdAt: "2026-09-04T18:12:00Z",
    status: "success",
    language: "Python",
    outputPreview: "Lookup helper returns None for no match; guard before indexing.",
  },
  {
    id: "gen_1039",
    toolSlug: "dockerfile",
    toolName: "Dockerfile Generator",
    inputSummary: "FastAPI service, port 8000, SQLite volume",
    createdAt: "2026-09-04T15:44:00Z",
    status: "success",
    outputPreview: "python:3.12-slim base, non-root user, healthcheck on /health.",
  },
  {
    id: "gen_1038",
    toolSlug: "regex-generator",
    toolName: "Regex Generator",
    inputSummary: "Validate college email addresses ending in .edu",
    createdAt: "2026-09-04T11:07:00Z",
    status: "success",
    outputPreview: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  },
  {
    id: "gen_1037",
    toolSlug: "unit-test",
    toolName: "Unit Test Generator",
    inputSummary: "apply_discount() pricing helper",
    createdAt: "2026-09-03T20:19:00Z",
    status: "success",
    language: "Python",
    outputPreview: "5 pytest cases including parametrised out-of-range discounts.",
  },
  {
    id: "gen_1036",
    toolSlug: "commit-message",
    toolName: "Commit Message Generator",
    inputSummary: "Added history persistence and search filters",
    createdAt: "2026-09-03T17:02:00Z",
    status: "success",
    outputPreview: "feat(history): persist tool runs and add search filters",
  },
  {
    id: "gen_1035",
    toolSlug: "api-docs",
    toolName: "API Documentation Generator",
    inputSummary: "reviews router — 2 endpoints",
    createdAt: "2026-09-03T09:48:00Z",
    status: "failed",
    language: "Python",
    outputPreview: "Upstream AI provider timed out after 30s. Nothing was stored.",
  },
];

export async function getHistory(): Promise<HistoryItem[]> {
  await delay(600);
  return MOCK_HISTORY;
}
