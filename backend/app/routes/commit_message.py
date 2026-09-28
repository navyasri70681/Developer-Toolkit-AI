from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_commit_message
from app.database.database import save_history


router = APIRouter()


class CommitMessageRequest(BaseModel):
    changes: str


@router.post("/commit-message")
def commit_message(request: CommitMessageRequest):

    if not request.changes.strip():
        raise HTTPException(
            status_code=400,
            detail="Changes cannot be empty"
        )

    try:
        result = generate_commit_message(request.changes)

        save_history(
            tool="commit-message",
            user_input=request.changes,
            response=result
        )

        return {
            "success": True,
            "changes": request.changes,
            "commit_message": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
