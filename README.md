# Developer Toolkit AI

A unified web application that brings eight everyday developer tasks
into a single interface: code review, bug explanation, SQL query
generation, regex generation, API documentation, commit message
generation, unit test generation, and Dockerfile generation.

## Features

- **Code Review** — structured feedback on code quality, security, and performance
- **Bug Explanation** — root cause analysis and a corrected code snippet
- **SQL Query Generator** — plain-English requirements turned into ready-to-run SQL
- **Regex Generator** — pattern descriptions turned into tested regular expressions
- **API Documentation Generator** — endpoint documentation straight from route code
- **Commit Message Generator** — well-formed Conventional Commits
- **Unit Test Generator** — a runnable test file covering happy paths and edge cases
- **Dockerfile Generator** — a production-shaped Dockerfile with build/run commands
- **Generation History** — every run is recorded and searchable

## Tech stack

- React + TypeScript
- Tailwind CSS
- TanStack Start (routing/framework)

This is the frontend layer, currently running on a local mock service
so every tool can be demonstrated end-to-end. It's built to plug into
a FastAPI + Python backend (SQLite for storage, OpenAI/Gemini API for
generation) without changing the UI.

## Running locally

You'll need [Bun](https://bun.sh) installed.

\`\`\`bash
git clone https://github.com/navyasri70681/Developer-Toolkit-AI.git
cd Developer-Toolkit-AI
bun install
bun run dev
\`\`\`

## Project structure

\`\`\`
src/        — application source (pages, components, mock service layer)
public/     — static assets
\`\`\`
