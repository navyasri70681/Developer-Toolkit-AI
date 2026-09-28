from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_docs
from app.database.database import save_history


router = APIRouter()


class DocsRequest(BaseModel):
    code: str
    language: str


@router.post("/generate-docs")
def generate_api_docs(request: DocsRequest):

    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty"
        )

    try:
        result = generate_docs(
            request.code,
            request.language
        )

        save_history(
            tool="generate-docs",
            user_input=request.code,
            response=result
        )

        return {
            "success": True,
            "language": request.language,
            "documentation": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
