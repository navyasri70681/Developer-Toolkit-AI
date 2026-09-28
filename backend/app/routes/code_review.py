from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import review_code
from app.database.database import save_history


router = APIRouter()


class CodeReviewRequest(BaseModel):
    code: str
    language: str


@router.post("/code-review")
def code_review(request: CodeReviewRequest):

    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty"
        )

    try:
        result = review_code(
            request.code,
            request.language
        )

        save_history(
            tool="code-review",
            user_input=request.code,
            response=result
        )

        return {
            "success": True,
            "language": request.language,
            "review": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
