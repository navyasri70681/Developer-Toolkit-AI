from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import explain_bug
from app.database.database import save_history


router = APIRouter()


class BugExplainRequest(BaseModel):
    code: str
    language: str


@router.post("/bug-explain")
def bug_explain(request: BugExplainRequest):

    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty"
        )

    try:
        result = explain_bug(
            request.code,
            request.language
        )

        save_history(
            tool="bug-explain",
            user_input=request.code,
            response=result
        )

        return {
            "success": True,
            "language": request.language,
            "explanation": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
