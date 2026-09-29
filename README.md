# Developer Toolkit AI

A full-stack AI-powered developer toolkit that brings eight everyday development tasks into one interface.

The application uses a React + TypeScript frontend, a FastAPI + Python backend, Groq for AI generation, and SQLite for generation history.

## Features

- **Code Review** — analyze code quality, security, performance, and maintainability
- **Bug Explanation** — identify root causes and suggest corrected code
- **SQL Query Generator** — convert natural-language requirements into SQL queries
- **Regex Generator** — generate ready-to-use regular expressions from descriptions
- **API Documentation Generator** — generate documentation from API route code
- **Commit Message Generator** — create Conventional Commit-style messages
- **Unit Test Generator** — generate tests covering common and edge cases
- **Dockerfile Generator** — generate practical Dockerfiles with build and run instructions
- **Generation History** — store and view previous AI generations
- **Dashboard** — view available tools, today's request count, and saved results

## Architecture

```text
React + TypeScript Frontend
          │
          │ HTTP / JSON
          ▼
FastAPI Backend
          │
          ├── Groq API
          │     └── openai/gpt-oss-20b
          │
          └── SQLite
                └── Generation History
```

## Tech Stack

### Frontend

- React
  - TypeScript
  - Tailwind CSS
  - TanStack Start / TanStack Router
  - Vite
  - React Markdown
  - Lucide React

### Backend

- Python
- FastAPI
  - Uvicorn
  - Pydantic
  - SQLite
  - python-dotenv
  - Groq API

### AI

- Groq API
  - Model: `openai/gpt-oss-20b`

### Development & Testing

- Git / GitHub
  - Docker
  - Postman

## Project Structure

```text
Developer-Toolkit-AI/
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── database.py
│   │   ├── routes/
│   │   │   ├── code_review.py
│   │   │   ├── bug_explain.py
│   │   │   ├── generate_sql.py
│   │   │   ├── generate_regex.py
│   │   │   ├── generate_docs.py
│   │   │   ├── commit_message.py
│   │   │   ├── unit_test.py
│   │   │   ├── dockerfile.py
│   │   │   └── history.py
│   │   ├── services/
│   │   │   └── ai_service.py
│   │   └── main.py
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── lib/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── public/
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

## Requirements

Make sure you have:

Node.js 20+
npm
Python 3.10+
Git
Docker (optional, for containerized backend)
A Groq API key
## Setup
### 1. Clone the repository
git clone https://github.com/navyasri70681/Developer-Toolkit-AI.git
cd Developer-Toolkit-AI
### 2. Frontend setup

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend runs on the Vite development server.

### 3. Backend setup

Open another terminal:

cd Developer-Toolkit-AI/backend

Create and activate a virtual environment:

python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt
### 4. Configure the Groq API key

Create:

backend/.env

Add:

GROQ_API_KEY=your_groq_api_key

Do not commit the .env file to Git.

### 5. Start the FastAPI backend

From the backend directory:

source venv/bin/activate
uvicorn app.main:app --reload

The backend runs on:

http://127.0.0.1:8000

Health check:

http://127.0.0.1:8000/health

Swagger API documentation:

http://127.0.0.1:8000/docs
## Frontend API Configuration

The frontend uses:

http://127.0.0.1:8000

by default.

A different backend URL can be supplied with:

VITE_API_BASE=http://127.0.0.1:8000
## API Endpoints
Method	Endpoint	Purpose
POST	/code-review	Review source code
POST	/bug-explain	Explain and fix bugs
POST	/generate-sql	Generate SQL
POST	/generate-regex	Generate regex
POST	/generate-docs	Generate API documentation
POST	/commit-message	Generate commit messages
POST	/unit-test	Generate unit tests
POST	/dockerfile	Generate Dockerfiles
GET	/history	Retrieve generation history
GET	/health	Backend health check
## Database

The backend uses SQLite to store generation history.

The history records include:

Tool used
User input
AI-generated response
Creation timestamp

The database is created automatically when the backend starts.

## Docker

The backend includes a Dockerfile for containerized deployment.

Build the image:

cd backend
docker build -t developer-toolkit-ai .

Run the container:

docker run --env-file .env -p 8001:8000 developer-toolkit-ai

The containerized backend can then be accessed at:

http://127.0.0.1:8001

Health check:

http://127.0.0.1:8001/health
## Testing

The backend APIs can be tested using:

Swagger UI at /docs
Postman
Frontend tool pages

The core API endpoints have been tested with successful requests and responses.

## Security Notes
API keys are stored in environment variables.
.env files are excluded from Docker builds.
API credentials should never be committed to Git.
CORS is configured for local frontend development.
## Team

Developer Toolkit AI is a collaborative GenAI project.

The project combines:

AI-powered developer utilities
Full-stack web development
FastAPI backend development
Prompt engineering
Database-backed history
Docker-based deployment
## License

This project is intended for educational and project-development purposes.
