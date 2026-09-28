from fastapi import APIRouter

from app.database.database import get_history


router = APIRouter()


@router.get("/history")
def history():

    return {
        "success": True,
        "history": get_history()
    }
