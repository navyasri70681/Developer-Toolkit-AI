from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import generate_dockerfile
from app.database.database import save_history


router = APIRouter()


class DockerfileRequest(BaseModel):
    project_description: str


@router.post("/dockerfile")
def generate_dockerfile_query(request: DockerfileRequest):

    if not request.project_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Project description cannot be empty"
        )

    try:
        result = generate_dockerfile(request.project_description)

        save_history(
            tool="dockerfile",
            user_input=request.project_description,
            response=result
        )

        return {
            "success": True,
            "project_description": request.project_description,
            "dockerfile": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )
