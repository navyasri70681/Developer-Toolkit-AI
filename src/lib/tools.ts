import {
  Bug,
  Container,
  FileCode2,
  FileText,
  GitCommitVertical,
  Regex,
  ScanSearch,
  Database,
  type LucideIcon,
} from "lucide-react";

import {
  explainBug,
  generateCommitMessage,
  generateDocs,
  generateDockerfile,
  generateRegex,
  generateSQL,
  generateUnitTests,
  reviewCode,
  type ToolInput,
  type ToolResult,
} from "@/services/api";

export type ToolField = {
  name: string;
  label: string;
  type: "select" | "textarea" | "text";
  options?: string[];
  placeholder?: string;
  rows?: number;
  mono?: boolean;
  required?: boolean;
  hint?: string;
};

export type ToolConfig = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  actionLabel: string;
  resultLabel: string;
  emptyHint: string;
  fields: ToolField[];
  run: (input: ToolInput) => Promise<ToolResult>;
};

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "PHP", "C#"];

export const TOOLS: ToolConfig[] = [
  {
    slug: "code-review",
    name: "Code Review",
    short: "Get a structured review covering quality, security and performance.",
    description:
      "Paste a snippet and receive a structured review: overall quality, concrete issues, security risks, performance notes and suggested improvements.",
    icon: ScanSearch,
    actionLabel: "Review Code",
    resultLabel: "Review",
    emptyHint: "Paste some code and run a review to see the findings here.",
    fields: [
      { name: "language", label: "Language", type: "select", options: LANGUAGES, required: true },
      {
        name: "code",
        label: "Code",
        type: "textarea",
        rows: 16,
        mono: true,
        required: true,
        placeholder: "def create_order(payload):\n    ...",
      },
    ],
    run: reviewCode,
  },
  {
    slug: "bug-explain",
    name: "Bug Explanation",
    short: "Understand an error message and get a corrected version of the code.",
    description:
      "Share the failing code and the error output to get the problem, its root cause, a plain-language explanation and a corrected snippet.",
    icon: Bug,
    actionLabel: "Explain Bug",
    resultLabel: "Explanation",
    emptyHint: "Add your code and the error message to get an explanation.",
    fields: [
      { name: "language", label: "Language", type: "select", options: LANGUAGES, required: true },
      {
        name: "code",
        label: "Code",
        type: "textarea",
        rows: 12,
        mono: true,
        required: true,
        placeholder: "email = get_user_email(user_id)[0]",
      },
      {
        name: "error",
        label: "Error message",
        type: "textarea",
        rows: 5,
        mono: true,
        required: true,
        placeholder: "TypeError: 'NoneType' object is not subscriptable",
      },
    ],
    run: explainBug,
  },
  {
    slug: "sql-generator",
    name: "SQL Query Generator",
    short: "Turn a plain-English requirement into a ready-to-run SQL query.",
    description:
      "Describe the data you need in plain language and pick a database. You get a formatted query plus a walkthrough of how it works.",
    icon: Database,
    actionLabel: "Generate SQL",
    resultLabel: "Generated SQL",
    emptyHint: "Describe the query you need in plain English.",
    fields: [
      {
        name: "database",
        label: "Database",
        type: "select",
        options: ["PostgreSQL", "MySQL", "SQLite", "SQL Server", "Oracle"],
        required: true,
      },
      {
        name: "requirement",
        label: "What should the query do?",
        type: "textarea",
        rows: 8,
        required: true,
        placeholder: "Top 20 customers by total spend on completed orders in the last 30 days",
      },
      {
        name: "schema",
        label: "Schema details (optional)",
        type: "textarea",
        rows: 6,
        mono: true,
        placeholder: "customers(id, full_name)\norders(id, customer_id, amount, status, created_at)",
      },
    ],
    run: generateSQL,
  },
  {
    slug: "regex-generator",
    name: "Regex Generator",
    short: "Describe a pattern in words and get a tested regular expression.",
    description:
      "Explain what the pattern should match. You get the expression, a token-by-token explanation, plus example matches and non-matches.",
    icon: Regex,
    actionLabel: "Generate Regex",
    resultLabel: "Generated Pattern",
    emptyHint: "Describe the text pattern you want to match.",
    fields: [
      {
        name: "description",
        label: "Pattern description",
        type: "textarea",
        rows: 8,
        required: true,
        placeholder: "Match a valid email address with a 2+ letter top-level domain",
      },
      {
        name: "flavour",
        label: "Flavour",
        type: "select",
        options: ["JavaScript", "Python", "PCRE", "Java", ".NET"],
      },
    ],
    run: generateRegex,
  },
  {
    slug: "api-docs",
    name: "API Documentation Generator",
    short: "Produce endpoint documentation straight from your route code.",
    description:
      "Paste your router or controller code to get structured documentation: endpoints, request bodies, responses and error cases.",
    icon: FileText,
    actionLabel: "Generate Documentation",
    resultLabel: "Documentation",
    emptyHint: "Paste your route or controller code to document it.",
    fields: [
      { name: "language", label: "Language", type: "select", options: LANGUAGES, required: true },
      {
        name: "framework",
        label: "Framework",
        type: "select",
        options: ["FastAPI", "Flask", "Django REST", "Express", "NestJS", "Spring Boot"],
        required: true,
      },
      {
        name: "code",
        label: "Route code",
        type: "textarea",
        rows: 14,
        mono: true,
        required: true,
        placeholder: '@router.post("/reviews")\nasync def create_review(payload: ReviewIn):\n    ...',
      },
    ],
    run: generateDocs,
  },
  {
    slug: "commit-message",
    name: "Commit Message Generator",
    short: "Write clear Conventional Commits from a description of your changes.",
    description:
      "Summarise what you changed and get a well-formed commit message with a subject, body, footer and a few alternatives.",
    icon: GitCommitVertical,
    actionLabel: "Generate Commit Message",
    resultLabel: "Commit Message",
    emptyHint: "Describe the changes you made in this commit.",
    fields: [
      {
        name: "changes",
        label: "Change description",
        type: "textarea",
        rows: 8,
        required: true,
        placeholder: "Saved every generation in SQLite and added search + tool filters to history",
      },
      {
        name: "type",
        label: "Commit type",
        type: "select",
        options: ["feat", "fix", "refactor", "docs", "test", "chore", "perf", "style"],
        required: true,
      },
    ],
    run: generateCommitMessage,
  },
  {
    slug: "unit-test",
    name: "Unit Test Generator",
    short: "Generate a test file with the happy paths and the edge cases.",
    description:
      "Paste a function or class and choose a testing framework to get a runnable test file, a list of covered cases and edge cases.",
    icon: FileCode2,
    actionLabel: "Generate Unit Tests",
    resultLabel: "Generated Tests",
    emptyHint: "Paste the function you want tests for.",
    fields: [
      { name: "language", label: "Language", type: "select", options: LANGUAGES, required: true },
      {
        name: "framework",
        label: "Testing framework",
        type: "select",
        options: ["pytest", "unittest", "Jest", "Vitest", "JUnit", "Go testing"],
        required: true,
      },
      {
        name: "code",
        label: "Code under test",
        type: "textarea",
        rows: 14,
        mono: true,
        required: true,
        placeholder: "def apply_discount(price, percent):\n    ...",
      },
    ],
    run: generateUnitTests,
  },
  {
    slug: "dockerfile",
    name: "Dockerfile Generator",
    short: "Container-ready Dockerfile with build and run commands.",
    description:
      "Describe your stack to get a production-shaped Dockerfile, a .dockerignore, and the exact build and run commands.",
    icon: Container,
    actionLabel: "Generate Dockerfile",
    resultLabel: "Dockerfile",
    emptyHint: "Pick your stack and generate a container setup.",
    fields: [
      { name: "language", label: "Language", type: "select", options: LANGUAGES, required: true },
      {
        name: "framework",
        label: "Framework",
        type: "select",
        options: ["FastAPI", "Flask", "Django", "Express", "Next.js", "Spring Boot"],
        required: true,
      },
      {
        name: "appType",
        label: "Application type",
        type: "select",
        options: ["REST API", "Web app", "Worker / job", "CLI tool"],
        required: true,
      },
      { name: "port", label: "Port", type: "text", placeholder: "8000", required: true },
      {
        name: "requirements",
        label: "Additional requirements (optional)",
        type: "textarea",
        rows: 5,
        placeholder: "Non-root user, healthcheck, persist SQLite in a volume",
      },
    ],
    run: generateDockerfile,
  },
];

export function getTool(slug: string): ToolConfig | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function defaultValues(tool: ToolConfig): ToolInput {
  const values: ToolInput = {};
  for (const field of tool.fields) {
    values[field.name] =
      field.type === "select" ? (field.options?.[0] ?? "") : field.name === "port" ? "8000" : "";
  }
  return values;
}
