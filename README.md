# Dev Toolkit AI

Build a complete, polished, responsive React frontend for a college Generative AI project called Developer Toolkit AI.

Project purpose

Developer Toolkit AI is a web application that brings 8 AI-powered developer tools into one platform:

Code Review

Bug Explanation

SQL Query Generator

Regex Generator

API Documentation Generator

Commit Message Generator

Unit Test Generator

Dockerfile Generator

The application will eventually connect to a Python FastAPI backend, SQLite database, and OpenAI/Gemini API. For now, build only the frontend using realistic mock data and mock API responses.

Tech stack

React

Tailwind CSS

React Router

Reusable components

Lucide icons

Design

Create a modern, professional developer-tool interface.

Use:

Clean typography

Subtle borders

Rounded cards

Good spacing

Code-editor-style input areas

Professional developer-focused colors

Responsive layouts

Accessible buttons and forms

Subtle hover effects

Avoid excessive gradients, clutter, childish design, and unnecessary animations.

Pages and routes

Create these pages:

/ — Home

/dashboard — Dashboard

/tool/code-review

/tool/bug-explain

/tool/sql-generator

/tool/regex-generator

/tool/api-docs

/tool/commit-message

/tool/unit-test

/tool/dockerfile

/history — Generation History

/about — About Team

Navigation

Create a responsive navbar with:

Developer Toolkit AI logo/name

Home

Dashboard

History

About

Dashboard/Open Toolkit button

On mobile, use a hamburger menu.

Home page

Create a professional landing page with:

Hero title:
"Your AI-Powered Developer Toolkit"

Subtitle:
"Review code, explain bugs, generate SQL and Regex, create API documentation, write commit messages, generate unit tests, and build Dockerfiles — all in one place."

Buttons:

Explore Developer Tools

View History

Add:

A visual preview of the toolkit

Section showing all 8 tools

Section explaining the benefits

Final CTA to open the dashboard

Dashboard

Create a professional dashboard with:

Title: "Developer Toolkit"

Subtitle: "Choose an AI-powered tool to improve your development workflow."

Display all 8 tools in a responsive card grid.

Each card must contain:

Icon

Tool name

Short description

Open Tool button

Navigation to the correct tool page

Add mock statistics:

8 AI Tools

24 Requests Today

12 Saved Results

Clearly treat these as demo statistics.

Reusable tool page

IMPORTANT: Do not build 8 unrelated layouts.

Create a reusable ToolPage component that can be configured for each tool.

Each tool page should contain:

Back to Dashboard button

Tool icon

Title

Description

Input section

Generate button

Clear button

Loading state

Result section

Copy button

Error state

Empty state

Use a two-column layout on desktop and stack vertically on mobile.

Tool inputs and mock results

Create appropriate inputs and realistic mock results for all 8 tools.

Code Review

Language dropdown

Code textarea

Review Code button

Mock result with quality, issues, security, performance, and improvements

Bug Explanation

Language dropdown

Code textarea

Error message textarea

Explain Bug button

Mock result with problem, cause, explanation, suggested fix, and corrected code

SQL Generator

Database dropdown

Natural language requirement textarea

Generate SQL button

Mock SQL code block

Explanation

Copy SQL button

Regex Generator

Pattern description textarea

Generate Regex button

Mock regex

Explanation

Example matches

Copy button

API Documentation

Language dropdown

Framework dropdown

Code textarea

Generate Documentation button

Mock structured API documentation

Copy button

Commit Message

Change description textarea

Commit type dropdown

Generate Commit Message button

Mock commit message

Alternative suggestions

Copy button

Unit Test

Language dropdown

Testing framework dropdown

Code textarea

Generate Unit Tests button

Mock test code

Test cases and edge cases

Copy button

Dockerfile

Language dropdown

Framework dropdown

Application type

Port

Additional requirements

Generate Dockerfile button

Mock Dockerfile

Build and run commands

Copy button

Mock API service

Create a centralized mock API service layer.

Use a structure such as:

src/services/api.js

Create mock functions:

reviewCode()

explainBug()

generateSQL()

generateRegex()

generateDocs()

generateCommitMessage()

generateUnitTests()

generateDockerfile()

getHistory()

Each function should simulate a short API delay and return a realistic mock response.

Do not hardcode mock responses directly inside every component.

The service layer must be easy to replace later with FastAPI endpoints.

History page

Create a professional history page using dummy data.

Display:

Tool name

Input summary

Date/time

Status

View button

Add:

Search

Tool filter

Clear History button

Detailed view of a history item

Use mock data only.

About Team page

Create an attractive project/team page.

Explain the project and show this architecture:

React Frontend → FastAPI Backend → AI Model → Response → React Frontend

Mention:

SQLite database for history

OpenAI/Gemini API for AI generation

Create team cards:

Meghana — Backend Lead
AI integration, FastAPI APIs, prompt engineering

Sushritha — Backend Developer
SQLite database, history, API testing, Docker

Navya — Frontend Developer
React UI, forms, result pages, responsive design

Srija — Research & Documentation
Literature survey, architecture, diagrams

Sadhiya — Testing & Presentation
Testing, screenshots, conclusion, PPT

Do not invent additional personal information.

Functionality

All pages and navigation must work.

All 8 tools must have functional mock generation flows.

Implement:

Input validation

Loading states

Error states

Empty states

Clear buttons

Copy-to-clipboard functionality

Download buttons where appropriate

Responsive design

Important

Do not implement the backend or real AI API calls.

Do not connect Supabase.

Keep all API-related logic inside the mock service layer.

The frontend will later be connected to the team's FastAPI backend.

Build the complete frontend, not just a landing page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d31e18b6-fb92-41db-8803-9b6b9dad60b6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
