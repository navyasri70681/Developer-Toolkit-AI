from fastapi import FastAPI

from app.database.database import create_history_table
from app.routes.history import router as history_router
from app.routes.code_review import router as code_review_router
from app.routes.bug_explain import router as bug_explain_router
from app.routes.generate_sql import router as generate_sql_router
from app.routes.generate_regex import router as generate_regex_router
from app.routes.generate_docs import router as generate_docs_router
from app.routes.commit_message import router as commit_message_router
from app.routes.unit_test import router as unit_test_router
from app.routes.dockerfile import router as dockerfile_router


app = FastAPI(
    title="Developer Toolkit AI",
    description="GenAI-powered toolkit for developers",
    version="1.0.0"
)


@app.on_event("startup")
def startup_event():
    create_history_table()


@app.get("/")
def root():
    return {
        "message": "Welcome to Developer Toolkit AI"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(code_review_router)
app.include_router(bug_explain_router)
app.include_router(generate_sql_router)
app.include_router(generate_regex_router)
app.include_router(generate_docs_router)
app.include_router(commit_message_router)
app.include_router(unit_test_router)
app.include_router(dockerfile_router)
app.include_router(history_router)
