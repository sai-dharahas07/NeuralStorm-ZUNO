from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import get_db
from app.models.quiz_attempt import QuizAttempt
from app.schemas.quiz import (
    QuizAttemptCreate,
    QuizAttemptResponse,
)

router = APIRouter(
    prefix="/api/v1/quiz",
    tags=["Quiz"],
)


@router.post(
    "/attempts",
    response_model=QuizAttemptResponse,
    status_code=201,
)
def create_quiz_attempt(
    attempt: QuizAttemptCreate,
    db: Session = Depends(get_db),
):
    if attempt.correct_answers > attempt.total_questions:
        raise HTTPException(
            status_code=400,
            detail="Correct answers cannot exceed total questions",
        )

    if attempt.score > 100:
        raise HTTPException(
            status_code=400,
            detail="Score cannot exceed 100",
        )

    try:
        new_attempt = QuizAttempt(
            **attempt.model_dump()
        )

        db.add(new_attempt)
        db.commit()
        db.refresh(new_attempt)

        return new_attempt

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save quiz attempt",
        ) from None


@router.get(
    "/attempts/{student_id}",
    response_model=list[QuizAttemptResponse],
)
def get_student_quiz_attempts(
    student_id: str,
    db: Session = Depends(get_db),
):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.student_id == student_id)
        .order_by(QuizAttempt.created_at.desc())
        .all()
    )

    return attempts