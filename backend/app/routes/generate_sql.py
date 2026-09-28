from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_sql
from app.database.database import save_history


router = APIRouter()


class SQLRequest(BaseModel):
    requirement: str


@router.post("/generate-sql")
def generate_sql_query(request: SQLRequest):

    if not request.requirement.strip():
        raise HTTPException(
            status_code=400,
            detail="Requirement cannot be empty"
        )

    try:
        result = generate_sql(request.requirement)

        save_history(
            tool="generate-sql",
            user_input=request.requirement,
            response=result
        )

        return {
            "success": True,
            "requirement": request.requirement,
            "sql": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
