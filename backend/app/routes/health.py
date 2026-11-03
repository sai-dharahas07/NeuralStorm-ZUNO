from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.database import check_database_connection

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "neural-storm-backend",
        "message": "Backend is running",
    }


@router.get("/health/database")
def database_health_check():
    try:
        connected = check_database_connection()

        if not connected:
            raise HTTPException(
                status_code=503,
                detail="Database is not configured",
            )

        return {
            "status": "ok",
            "database": "connected",
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        ) from None