# Developer Toolkit AI

**Developer Toolkit AI** is a full-stack AI-powered developer toolkit that brings eight everyday developer tasks into one interface.

The application combines a **React + TypeScript frontend**, **FastAPI + Python backend**, **Groq AI**, and **SQLite** to provide practical AI-powered utilities for developers.

## ✨ Features

- 🔍 **Code Review** — Analyze code quality, security, performance, and maintainability.
- 🐞 **Bug Explanation** — Identify bugs, explain their root causes, and suggest fixes.
- 🗄️ **SQL Query Generator** — Convert natural-language requirements into SQL queries.
- 🔤 **Regex Generator** — Generate ready-to-use regular expressions from descriptions.
- 📚 **API Documentation Generator** — Generate documentation from API route code.
- 💬 **Commit Message Generator** — Create clear Conventional Commit-style messages.
- 🧪 **Unit Test Generator** — Generate unit tests covering common and edge cases.
- 🐳 **Dockerfile Generator** — Generate practical Dockerfiles with build and run instructions.
- 🕘 **Generation History** — Store and view previous AI generations.
- 📊 **Dashboard** — View available tools, today's requests, and saved results.

## 🏗️ Architecture

    React + TypeScript Frontend
                 |
                 | HTTP / JSON
                 v
          FastAPI Backend
             /        \
            /          \
           v            v
      Groq API       SQLite
           |          |
           v          v
    gpt-oss-20b   Generation History

## 🛠️ Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Tailwind CSS**
- **TanStack Start**
- **TanStack Router**
- **Vite**
- **React Markdown**
- **Lucide React**

### Backend

- **Python**
- **FastAPI**
- **Uvicorn**
- **Pydantic**
- **SQLite**
- **python-dotenv**

### AI

- **Groq API**
- **Model:** `openai/gpt-oss-20b`

### Development & Testing

- **Git / GitHub**
- **Docker**
- **Postman**
- **Swagger UI**

## 📁 Project Structure

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
    │   ├── Dockerfile
    │   ├── .dockerignore
    │   └── requirements.txt
    │
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   ├── routes/
    │   └── services/
    │
    ├── public/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    └── README.md

## 📋 Requirements

Before running the project, make sure you have:

- **Node.js 20+**
- **npm**
- **Python 3.10+**
- **Git**
- **Docker** *(optional)*
- **Groq API key**

## 🚀 Setup

### 1. Clone the repository

    git clone https://github.com/meghana-1603/Developer-Toolkit-AI.git
    cd Developer-Toolkit-AI

### 2. Install frontend dependencies

    npm install

### 3. Start the frontend

    npm run dev

The frontend will run on the local Vite development server.

### 4. Set up the backend

Open a new terminal:

    cd ~/Developer-Toolkit-AI/backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

### 5. Configure the Groq API key

Create:

    backend/.env

Add:

    GROQ_API_KEY=your_groq_api_key

**Never commit your `.env` file or API key to GitHub.**

### 6. Start the FastAPI backend

    source venv/bin/activate
    uvicorn app.main:app --reload

Backend:

`http://127.0.0.1:8000`

Swagger documentation:

`http://127.0.0.1:8000/docs`

Health check:

`http://127.0.0.1:8000/health`

## 🔌 Frontend API Configuration

The frontend uses this backend URL by default:

`http://127.0.0.1:8000`

You can optionally configure it with:

    VITE_API_BASE=http://127.0.0.1:8000

## 📡 API Endpoints

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/code-review` | Review source code |
| `POST` | `/bug-explain` | Explain and fix bugs |
| `POST` | `/generate-sql` | Generate SQL queries |
| `POST` | `/generate-regex` | Generate regular expressions |
| `POST` | `/generate-docs` | Generate API documentation |
| `POST` | `/commit-message` | Generate commit messages |
| `POST` | `/unit-test` | Generate unit tests |
| `POST` | `/dockerfile` | Generate Dockerfiles |
| `GET` | `/history` | Retrieve generation history |
| `GET` | `/health` | Check backend health |

## 🗃️ Database

The backend uses **SQLite** to store generation history.

Each history record contains:

- **Tool used**
- **User input**
- **AI-generated response**
- **Creation timestamp**

The database is created automatically when the backend starts.

## 🐳 Docker

### Build the backend image

    cd ~/Developer-Toolkit-AI/backend
    docker build -t developer-toolkit-ai .

### Run the container

    docker run --env-file .env -p 8001:8000 developer-toolkit-ai

Containerized backend:

`http://127.0.0.1:8001`

Health check:

`http://127.0.0.1:8001/health`

## 🧪 Testing

The application has been tested using:

- **Swagger UI**
- **Postman**
- **Frontend tool pages**
- **Direct API requests**
- **Dockerized backend**

Core AI tool endpoints and the history API have been tested successfully.

## 🔐 Security

- API keys are stored using environment variables.
- `.env` files are excluded from Docker builds.
- API credentials should never be committed to Git.
- CORS is configured for local frontend development.

## 👥 Team

**Developer Toolkit AI** is a collaborative GenAI project combining:

- AI-powered developer utilities
- Full-stack web development
- FastAPI backend development
- Prompt engineering
- Database-backed generation history
- Docker-based deployment

## 📌 Project Status

The project currently includes:

- ✅ 8 AI developer tools
- ✅ FastAPI backend
- ✅ React + TypeScript frontend
- ✅ Groq AI integration
- ✅ SQLite generation history
- ✅ Dashboard
- ✅ Docker support
- ✅ Postman API testing
- ✅ Swagger API documentation

## 📄 License

This project is intended for educational and project-development purposes.
