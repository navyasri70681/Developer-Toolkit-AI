from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_regex
from app.database.database import save_history


router = APIRouter()


class RegexRequest(BaseModel):
    requirement: str


@router.post("/generate-regex")
def generate_regex_query(request: RegexRequest):

    if not request.requirement.strip():
        raise HTTPException(
            status_code=400,
            detail="Requirement cannot be empty"
        )

    try:
        result = generate_regex(request.requirement)

        save_history(
            tool="generate-regex",
            user_input=request.requirement,
            response=result
        )

        return {
            "success": True,
            "requirement": request.requirement,
            "regex": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
