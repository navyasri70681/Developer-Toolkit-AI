from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_unit_tests
from app.database.database import save_history


router = APIRouter()


class UnitTestRequest(BaseModel):
    code: str
    language: str


@router.post("/unit-test")
def generate_unit_test(request: UnitTestRequest):

    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="Code cannot be empty"
        )

    try:
        result = generate_unit_tests(
            request.code,
            request.language
        )

        save_history(
            tool="unit-test",
            user_input=request.code,
            response=result
        )

        return {
            "success": True,
            "language": request.language,
            "tests": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
