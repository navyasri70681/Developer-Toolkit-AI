export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export type ResultBlock =
  | { kind: "text"; title: string; body: string }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "code"; title: string; language: string; code: string }
  | {
      kind: "meta";
      title: string;
      entries: { label: string; value: string }[];
    };

export type ToolResult = {
  headline: string;
  summary: string;
  blocks: ResultBlock[];
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

async function post<T>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "detail" in data &&
      typeof data.detail === "string"
        ? data.detail
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "detail" in data &&
      typeof data.detail === "string"
        ? data.detail
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

function textResult(
  headline: string,
  summary: string,
  body: string,
  downloadName?: string
): ToolResult {
  return {
    headline,
    summary,
    blocks: [
      {
        kind: "text",
        title: "AI Response",
        body,
      },
    ],
    copyText: body,
    downloadName,
  };
}

function extractGeneratedCode(markdown: string): {
  code: string;
  language: string;
  explanation: string;
} {
  const fenceRegex = /```([a-zA-Z0-9+#.-]*)\n([\s\S]*?)```/g;
  const blocks: { language: string; code: string }[] = [];

  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(markdown)) !== null) {
    const language = match[1] || "text";
    const code = match[2].trim();

    if (!/^[a-zA-Z0-9+#.-]+Copy$/i.test(code)) {
      blocks.push({ language, code });
    }
  }

  if (blocks.length === 0) {
    return {
      code: markdown.trim(),
      language: "text",
      explanation: "",
    };
  }

  const selected = blocks[0];

  const explanation = markdown
    .replace(/```([a-zA-Z0-9+#.-]*)\n([\s\S]*?)```/g, (full, language, code) => {
      const cleaned = code.trim();

      if (/^[a-zA-Z0-9+#.-]+Copy$/i.test(cleaned)) {
        return "";
      }

      if (cleaned === selected.code && language === selected.language) {
        return "";
      }

      return full;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    code: selected.code,
    language: selected.language,
    explanation,
  };
}

function artifactResult(
  headline: string,
  summary: string,
  markdown: string,
  fallbackLanguage: string,
  downloadName: string
): ToolResult {
  const extracted = extractGeneratedCode(markdown);

  const blocks: ResultBlock[] = [];

  if (extracted.explanation) {
    blocks.push({
      kind: "text",
      title: "AI Explanation",
      body: extracted.explanation,
    });
  }

  blocks.push({
    kind: "code",
    title: "Generated Code",
    language:
      (extracted.language === "text"
        ? fallbackLanguage
        : extracted.language
      ).replace(/Copy$/i, ""),
    code: extracted.code,
  });

  return {
    headline,
    summary,
    blocks,
    copyText: extracted.code,
    downloadName,
  };
}

function codeResult(
  headline: string,
  summary: string,
  code: string,
  language: string,
  downloadName?: string
): ToolResult {
  return {
    headline,
    summary,
    blocks: [
      {
        kind: "code",
        title: "Generated Code",
        language,
        code,
      },
    ],
    copyText: code,
    downloadName,
  };
}

// ─────────────────────────────────────────────
// Code Review
// ─────────────────────────────────────────────

type CodeReviewResponse = {
  success: boolean;
  language: string;
  review: string;
};

export async function reviewCode(
  values: ToolInput
): Promise<ToolResult> {
  const data = await post<CodeReviewResponse>("/code-review", {
    code: values.code,
    language: values.language,
  });

  return textResult(
    "Code review complete",
    `AI review for ${data.language}.`,
    data.review
  );
}

// ─────────────────────────────────────────────
// Bug Explanation
// ─────────────────────────────────────────────

type BugExplainResponse = {
  success: boolean;
  language: string;
  explanation: string;
};

export async function explainBug(
  values: ToolInput
): Promise<ToolResult> {
  const errorDetails = values.error?.trim()
    ? `\n\nError message:\n${values.error}`
    : "";

  const data = await post<BugExplainResponse>("/bug-explain", {
    code: `${values.code}${errorDetails}`,
    language: values.language,
  });

  return textResult(
    "Bug explanation complete",
    `AI explanation for ${data.language}.`,
    data.explanation
  );
}

// ─────────────────────────────────────────────
// SQL Generator
// ─────────────────────────────────────────────

type SQLResponse = {
  success: boolean;
  requirement: string;
  sql: string;
};

export async function generateSQL(
  values: ToolInput
): Promise<ToolResult> {
  const extraContext = [
    values.database?.trim()
      ? `Database: ${values.database}`
      : "",
    values.schema?.trim()
      ? `Schema:\n${values.schema}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const requirement = [values.requirement, extraContext]
    .filter(Boolean)
    .join("\n\n");

  const data = await post<SQLResponse>("/generate-sql", {
    requirement,
  });

  return artifactResult(
    "SQL query generated",
    "AI-generated SQL query based on your requirement.",
    data.sql,
    "sql",
    "generated-query.sql"
  );
}

// ─────────────────────────────────────────────
// Regex Generator
// ─────────────────────────────────────────────

type RegexResponse = {
  success: boolean;
  requirement: string;
  regex: string;
};

export async function generateRegex(
  values: ToolInput
): Promise<ToolResult> {
  const requirement = [
    values.description,
    values.flavour?.trim()
      ? `Regex flavour: ${values.flavour}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const data = await post<RegexResponse>("/generate-regex", {
    requirement,
  });

  return artifactResult(
    "Regex generated",
    "AI-generated regular expression based on your requirement.",
    data.regex,
    values.flavour?.toLowerCase() || "regex",
    "generated-regex.txt"
  );
}

// ─────────────────────────────────────────────
// API Documentation
// ─────────────────────────────────────────────

type DocsResponse = {
  success: boolean;
  language: string;
  documentation: string;
};

export async function generateDocs(
  values: ToolInput
): Promise<ToolResult> {
  const frameworkContext = values.framework?.trim()
    ? `\n\nFramework: ${values.framework}`
    : "";

  const data = await post<DocsResponse>("/generate-docs", {
    code: `${values.code}${frameworkContext}`,
    language: values.language,
  });

  return textResult(
    "API documentation generated",
    `Documentation generated for ${data.language}.`,
    data.documentation,
    "api-documentation.md"
  );
}

// ─────────────────────────────────────────────
// Commit Message
// ─────────────────────────────────────────────

type CommitMessageResponse = {
  success: boolean;
  changes: string;
  commit_message: string;
};

export async function generateCommitMessage(
  values: ToolInput
): Promise<ToolResult> {
  const typeContext = values.type?.trim()
    ? `\n\nCommit type: ${values.type}`
    : "";

  const data = await post<CommitMessageResponse>("/commit-message", {
    changes: `${values.changes}${typeContext}`,
  });

  return textResult(
    "Commit message generated",
    "AI-generated Git commit message.",
    data.commit_message,
    "commit-message.txt"
  );
}

// ─────────────────────────────────────────────
// Unit Test Generator
// ─────────────────────────────────────────────

type UnitTestResponse = {
  success: boolean;
  language: string;
  tests: string;
};

export async function generateUnitTests(
  values: ToolInput
): Promise<ToolResult> {
  const frameworkContext = values.framework?.trim()
    ? `\n\nTesting framework: ${values.framework}`
    : "";

  const data = await post<UnitTestResponse>("/unit-test", {
    code: `${values.code}${frameworkContext}`,
    language: values.language,
  });

  return artifactResult(
    "Unit tests generated",
    `AI-generated tests for ${data.language}.`,
    data.tests,
    data.language.toLowerCase(),
    "generated-tests.txt"
  );
}

// ─────────────────────────────────────────────
// Dockerfile Generator
// ─────────────────────────────────────────────

type DockerfileResponse = {
  success: boolean;
  project_description: string;
  dockerfile: string;
};

export async function generateDockerfile(
  values: ToolInput
): Promise<ToolResult> {
  const projectDescription = [
    values.appType
      ? `Application type: ${values.appType}`
      : "",
    values.language
      ? `Language: ${values.language}`
      : "",
    values.framework
      ? `Framework: ${values.framework}`
      : "",
    values.port
      ? `Port: ${values.port}`
      : "",
    values.requirements
      ? `Requirements/dependencies:\n${values.requirements}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const data = await post<DockerfileResponse>("/dockerfile", {
    project_description: projectDescription,
  });

  return artifactResult(
    "Dockerfile generated",
    "AI-generated Docker configuration.",
    data.dockerfile,
    "dockerfile",
    "Dockerfile"
  );
}

// ─────────────────────────────────────────────
// History
// ─────────────────────────────────────────────

type BackendHistoryItem = {
  id: number;
  tool: string;
  user_input: string;
  response: string;
  created_at: string;
};

type HistoryResponse = {
  success: boolean;
  history: BackendHistoryItem[];
};

const TOOL_NAMES: Record<string, string> = {
  "code-review": "Code Review",
  "bug-explain": "Bug Explanation",
  "generate-sql": "SQL Query Generator",
  "generate-regex": "Regex Generator",
  "generate-docs": "API Documentation Generator",
  "commit-message": "Commit Message Generator",
  "unit-test": "Unit Test Generator",
  dockerfile: "Dockerfile Generator",
};

const TOOL_SLUGS: Record<string, string> = {
  "code-review": "code-review",
  "bug-explain": "bug-explain",
  "generate-sql": "sql-generator",
  "generate-regex": "regex-generator",
  "generate-docs": "api-docs",
  "commit-message": "commit-message",
  "unit-test": "unit-test",
  dockerfile: "dockerfile",
};

function createPreview(value: string, maxLength: number): string {
  const cleaned = value.replace(/\s+/g, " ").trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength)}...`;
}

function extractHistoryLanguage(userInput: string): string | undefined {
  const match = userInput.match(/(?:Programming Language|Language):\s*([^\n]+)/i);
  return match?.[1]?.trim() || undefined;
}

export async function getHistory(): Promise<HistoryItem[]> {
  const data = await get<HistoryResponse>("/history");

  return data.history.map((item) => ({
    id: String(item.id),
    toolSlug: TOOL_SLUGS[item.tool] || item.tool,
    toolName: TOOL_NAMES[item.tool] || item.tool,
    inputSummary: createPreview(item.user_input, 120),
    createdAt: item.created_at,
    status: "success",
    language: extractHistoryLanguage(item.user_input),
    outputPreview: createPreview(item.response, 180),
  }));
}
